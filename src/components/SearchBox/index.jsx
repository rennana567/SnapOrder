import { 
    memo,
    useRef,
    useState,
    useEffect,
    useMemo
} from 'react'
import {
    ArrowLeft,
    Close
} from '@react-vant/icons'
import styles from './searchbox.module.css'
import { debounce } from '../../utils'
const searchBox = (props) => {
    // api
    // 单向数据流
    // 子父通信
    const [query, setQuery] = useState('')
    const {handleQuery} = props
    const handleChange = (e)=>{
        let val = e.currentTarget.value
        setQuery(val)
    }
    const clearQuery = ()=>{ 
        setQuery('')
        queryRef.current.value = ''
        queryRef.current.focus()
    }
    const displayStyle = query ? {display: 'block'} : {display: 'none'}

    // 非受控组件
    const queryRef = useRef(null)
    // 1.防抖
    // 2.useMemo缓存debounce结果 否则会反复执行
    const handleQueryDebounce = useMemo(()=>{
        return debounce(handleQuery,500)
    })
    
    useEffect(()=>{
        console.log(query,'////////////')
        handleQueryDebounce(query)
    }, [query])

    return (
        <div className={styles.wrapper}>
           <ArrowLeft onClick={()=>history.back()}/>
            <input 
            type="text" 
            className={styles.ipt}
            placeholder='搜索旅游相关'
            ref={queryRef}
            onChange={handleChange}
            />
            
            {/* 移动端用户体验 */}
            <Close onClick={clearQuery} style={displayStyle} />
        </div>
        
    )
}

export default memo(searchBox);
