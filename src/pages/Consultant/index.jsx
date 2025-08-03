// src/pages/Consultant/index.jsx
import useTitle from '@/hooks/useTitle'
import {
  chat,
  kimChat,
  openaiChat
} from '@/llm'
import { 
  useEffect,
  useState 
} from 'react'
import styles from './consultant.module.css'
import {
  Button,
  Input,
  Loading,
  Toast
} from 'react-vant'
import { ChatO, UserO } from '@react-vant/icons'

// 导入提示词
import { consultantPrompt } from '@/llm'

const Consultant = () => {  
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  // 初始化对话历史
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: '您好！我是您的点餐助手，可以为您推荐地方菜系和根据您的口味偏好推荐菜品。请问您想吃什么类型的菜呢？',
      role: 'assistant'
    }
  ])
  
  const handleChat = async() => {
    if(text.trim() === '') {
      Toast.info('请输入消息')
      return;
    }
    
    // 添加用户消息
    const userMessage = {
      id: Date.now(),
      content: text,
      role: 'user'
    }
    
    setMessages(prev => [...prev, userMessage])
    setText('')
    setIsSending(true)
    
    try {
      // 构造完整的对话历史（只取最近几条以控制token数量）
      const conversationHistory = messages.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      // 添加系统提示词
      const systemMessage = { role: 'system', content: consultantPrompt }
      
      const apiMessages = [systemMessage, ...conversationHistory, { role: 'user', content: text }]
      
      const newMessage = await openaiChat(apiMessages);
      
      setMessages(prev => [
        ...prev, 
        {
          id: Date.now() + 1,
          content: newMessage.data.content,
          role: 'assistant'
        }
      ])
    } catch (error) {
      Toast.fail('消息发送失败')
      console.error(error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleChat(); // 执行提交逻辑
    }
  };

  useTitle('点单智能客服')

  return (
    <div className='flex flex-col h-all'>
      <div className={`${styles.chatArea} flex-1`}>
        {
          messages.map((message, index) => (
            <div 
              key={message.id || index}
              className={
                message.role === 'user' ? 
                styles.messageRight : 
                styles.messageLeft
              }
            >
              {
                message.role === 'assistant' ? 
                <ChatO /> :
                <UserO />
              }
              {message.content}
            </div>
          ))
        }
      </div>
      <div className={`flex ${styles.inputArea}`}>
        <Input
          value={text}
          onChange={(value) => setText(value)}
          placeholder='请输入消息，例如"推荐几道川菜"'
          className={`${styles.input} flex-1`}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <Button disabled={isSending} type='primary' onClick={handleChat}>
          {isSending ? '发送中...' : '发送'}
        </Button>
      </div>
      {isSending && (
        <div className='fixed-loading'>
          <Loading type='ball' textSize='14px'>
            智能推荐中
          </Loading>
        </div>
      )}
    </div>
  )
}

export default Consultant