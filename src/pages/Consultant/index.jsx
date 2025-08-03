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

const Consultant = () => {  
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  // 数据驱动界面
  // 静态界面
  const [messages,setMessages] = useState([
    {
      id:1,
      content:'hello,I am your assistant',
      role:'assistant'
    },
    {
      id:2,
      content:'hello',
      role:'user'
    }
  ])
  const handleChat = async() => {
    if(text.trim()==='') {
      Toast.info('请输入消息')
    }
    setIsSending(true)
    setText('')
    setMessages([
      ...messages,
      {
        id:messages.length+1,
        content:text,
        role:'user'
      }
    ])
    const newMessage = await openaiChat([{
      role:'user',
      content:text
    }]);
    setMessages((prev) => {
      return [
      ...prev,
      newMessage.data
      ]
    })
    setIsSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleChat(); // 执行提交逻辑
    }
  };

  useTitle('点单智能客服')

  return (
    <div className='flex flex-col h-all'>
      <div className={`${styles.chatArea} flex-1`}>
        {
          messages.map((message,index) => (
            <div 
            key={index}
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
          onChange={(value)=>setText(value)}
          placeholder='请输入消息'
          className={`${styles.input} flex-1`}
          onKeyDown={handleKeyDown}
        />
        <Button disabled={isSending}  type='primary' onClick={handleChat}>发送</Button>
      </div>
      {isSending && (<div className='fixed-loading'>
        <Loading type='ball'/>
      </div>)}
    </div>
  )
}

export default Consultant