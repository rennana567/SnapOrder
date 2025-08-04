import {
    useRef
} from 'react'
import {
    useUserStore
} from '@/store/useUserStore'
import { useNavigate } from 'react-router-dom'
import styles from './login.module.css'

const Login = () => {
    const usernameRef = useRef()
    const passwordRef = useRef()
    const { login } = useUserStore()
    const navigate = useNavigate()
    const handleLogin = (e) => {
        e.preventDefault()
        const username = usernameRef.current.value
        const password = passwordRef.current.value
        if(!username || !password) {
            alert('请输入用户名和密码')
            return
        }
        login({ username, password })
        setTimeout(()=>{
            navigate('/account')
        },1000)
    }
    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin} className={styles.form}>
                <h2 className={styles.title}>用户登录</h2>
                <div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>用户名</label>
                        <input
                            type="text"
                            id='username'
                            ref={usernameRef}
                            required
                            placeholder='请输入用户名'
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>密码</label>
                        <input
                            type="password"
                            ref={passwordRef}
                            id='password'
                            placeholder='请输入密码'
                            required
                            className={styles.input}
                        />
                    </div>
                </div>
                <div>
                    <button type="submit" className={styles.button}>登录</button>
                </div>
            </form>
        </div>
    )
}

export default Login;