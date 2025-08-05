import { 
    memo,
    useRef,
    useState,
    useEffect,
    useMemo
} from 'react'
import {
    ArrowLeft,
    Close,
    Search
} from '@react-vant/icons'
import styles from './searchbox.module.css'
import { debounce } from '@/utils'

const SearchBox = (props) => {
    const [query, setQuery] = useState('')
    const { handleQuery, onSearch } = props
    const queryRef = useRef(null)

    const handleChange = (e) => {
        let val = e.currentTarget.value
        setQuery(val)
    }

    const clearQuery = () => { 
        setQuery('')
        if (queryRef.current) {
            queryRef.current.value = ''
            queryRef.current.focus()
        }
    }

    const handleSearch = () => {
        if (query.trim()) {
            handleQuery(query.trim())
            if (onSearch) {
                onSearch(query.trim())
            }
            setQuery('')
            if (queryRef.current) {
                queryRef.current.value = ''
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const displayStyle = query ? { display: 'block' } : { display: 'none' }

    // 防抖
    const handleQueryDebounce = useMemo(() => {
        return debounce((q) => {
            handleQuery(q);
        }, 200)
    }, [handleQuery])
    
    useEffect(() => {
        if (query) {
            handleQueryDebounce(query)
        } else {
            // 如果查询为空，立即清除结果
            handleQuery('')
        }
    }, [query, handleQueryDebounce])

    return (
        <div className={styles.wrapper}>
            <ArrowLeft onClick={() => history.back()} className={styles.arrowLeft} />
            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} onClick={handleSearch} />
                <input 
                    type="text" 
                    className={styles.ipt}
                    placeholder='搜索菜品'
                    ref={queryRef}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    value={query}
                />
                <Close onClick={clearQuery} style={displayStyle} className={styles.clearIcon} />
            </div>
        </div>
    )
}

export default memo(SearchBox)