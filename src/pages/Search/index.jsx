import SearchBox from '@/components/SearchBox'
import { 
    useState, 
    useEffect,
    memo,
    useCallback, 
    use
} from 'react';
import styles from './search.module.css';
import useSearchStore from '@/store/useSearchStore';
import useTitle from '@/hooks/useTitle'

const HotListItems = memo((prpos) => {
    // console.log('-------',prpos)
    const {hotList} = prpos;
    // console.log('hotList1111',hotList)
    return(
      <div className={styles.hot}>
          <h1>热门菜品推荐</h1>
          {
            hotList.map((item)=>(
              <div key={item.id} className={styles.item}>{item.city}</div>
            ))
          }
      </div>
    )
})
const SearchPage = () => {
  useTitle('搜索');
  const [query, setQuery] = useState('');
  const {
    hotList,
    setHotList,
    suggestList,
    setSuggestList
  } = useSearchStore();
  // 单向数据流
  // 反复生成 useCallback
  const handleQuery = useCallback((query) => {
    // api 请求
    // console.log(query, '111111')
    setQuery(query)
    if (!query) {
      return
    }
    setSuggestList(query)
  },[])
  const suggestListStyle = {
    display: query ==  '' ? 'none' : 'block'
  }

  useEffect(()=>{
    setHotList()
  },[])

  return (
    <div className={styles.container}>

      <div className={styles.wrapper}>
        <SearchBox handleQuery={handleQuery} />
        {/* 维护性 */}
        <HotListItems hotList={hotList}/>
        <div className={styles.list} style={suggestListStyle}>
          {
            suggestList.map((item, index) => (
              <div key={index} className={styles.item} onClick={() => handleQuery(item)}>{item}</div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default SearchPage;