import useTitle from '@/hooks/useTitle'
import {
  chat,
  kimChat,
  openaiChat
} from '@/llm'
import { 
  useEffect,
  useState,
  useRef
} from 'react'
import styles from './consultant.module.css'
import {
  Button,
  Input,
  Toast
} from 'react-vant'
import { ChatO, UserO } from '@react-vant/icons'

// prompt
import { consultantPrompt } from '@/llm'

const Consultant = () => {  
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef(null) // 用于自动滚动到底部
  
  // 初始化对话历史
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: '您好！我是您的点餐助手，可以为您推荐地方菜系和根据您的口味偏好推荐菜品。请问您想吃什么类型的菜呢？',
      role: 'assistant'
    }
  ])
  
  // 用于流式输出的状态
  const [streamingMessage, setStreamingMessage] = useState({
    id: null,
    content: '',
    role: 'assistant'
  })
  
  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingMessage.content])
  
  // 流式输出
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
      
      const apiMessages = [
        systemMessage,
        ...conversationHistory,
        { role: 'user', content: text }
      ]
      
      // 初始化流式消息
      const newMessageId = Date.now() + 1
      setStreamingMessage({
        id: newMessageId,
        content: '',
        role: 'assistant'
      })
      
      // 调用支持流式输出的API（这里模拟流式输出）
      await streamResponse(apiMessages, newMessageId)
      
    } catch (error) {
      Toast.fail('消息发送失败')
      console.error(error)
    } finally {
      setIsSending(false)
      setStreamingMessage({
        id: null,
        content: '',
        role: 'assistant'
      })
    }
  }
  
  // 模拟流式输出
  const streamResponse = async (apiMessages, messageId) => {
    try {
      // 获取完整响应
      const response = await openaiChat(apiMessages)
      const fullContent = response.data.content
      
      // 模拟逐字输出效果
      let accumulatedContent = ''
      for (let i = 0; i < fullContent.length; i++) {
        accumulatedContent += fullContent[i]
        setStreamingMessage(prev => ({
          ...prev,
          id: messageId,
          content: accumulatedContent
        }))
        
        // 控制输出速度（可以根据需要调整）
        await new Promise(resolve => setTimeout(resolve, 20))
      }
      
      // 将完整消息添加到消息列表中
      setMessages(prev => [
        ...prev, 
        {
          id: messageId,
          content: fullContent,
          role: 'assistant'
        }
      ])
    } catch (error) {
      throw error
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
        
        {/* 流式输出消息 */}
        {streamingMessage.content && (
          <div className={styles.messageLeft}>
            <ChatO />
            {streamingMessage.content}
            <span className={styles.cursor}></span> {/* 光标动画 */}
          </div>
        )}
        
        {/* 用于自动滚动的锚点 */}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
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
    </div>
  )
}

export default Consultant