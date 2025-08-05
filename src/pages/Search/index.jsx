import SearchBox from '@/components/SearchBox'
import { 
    useState, 
    useEffect,
    memo,
    useCallback 
} from 'react';
import styles from './search.module.css';
import useSearchStore from '@/store/useSearchStore';
import useTitle from '@/hooks/useTitle'
import { Delete } from '@react-vant/icons';
import { Dialog } from 'react-vant';

const HistoryItem = memo(({ keyword, onDelete }) => {
  return (
    <div className={styles.historyItem}>
      <span className={styles.historyText} onClick={() => onDelete(keyword, false)}>{keyword}</span>
      <Delete 
        className={styles.deleteIcon} 
        onClick={() => onDelete(keyword, true)} 
      />
    </div>
  );
});

const HotListItems = memo((props) => {
    const {hotList} = props;
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
  const [historyList, setHistoryList] = useState([]);
  const [lastSearchQuery, setLastSearchQuery] = useState(''); // 用于跟踪最后一次搜索的查询
  const {
    hotList,
    setHotList,
    suggestList,
    setSuggestList
  } = useSearchStore();

  // 加载历史记录
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setHistoryList(history);
  }, []);

  // 保存历史记录到localStorage
  const saveHistory = (newHistory) => {
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    setHistoryList(newHistory);
  };

  // 添加搜索历史
  const addToHistory = (keyword) => {
    if (!keyword.trim()) return;
    
    const newHistory = [...historyList];
    const index = newHistory.indexOf(keyword.trim());
    
    // 如果已存在，移到最前面；否则添加到最前面
    if (index > -1) {
      newHistory.splice(index, 1);
    }
    newHistory.unshift(keyword.trim());
    
    // 限制最多20条记录
    if (newHistory.length > 20) {
      newHistory.splice(20);
    }
    
    saveHistory(newHistory);
  };

  const handleQuery = useCallback((query) => {
    setQuery(query);
    // 只有当查询不为空时才更新最后搜索查询
    if (query) {
      setLastSearchQuery(query);
    }
    // 只有当查询与最后一次搜索查询匹配时才显示建议
    if (query && query === lastSearchQuery) {
      setSuggestList(query);
    }
  }, [lastSearchQuery]);

  // 删除历史记录
  const deleteHistoryItem = (keyword, isDeleteSingle) => {
    if (isDeleteSingle) {
      const newHistory = historyList.filter(item => item !== keyword);
      saveHistory(newHistory);
    } else {
      setQuery(keyword);
      setSuggestList(keyword);
      setLastSearchQuery(keyword);
    }
  };

  // 清空所有历史记录
  const clearAllHistory = () => {
    Dialog.confirm({
      title: '确认清空',
      message: '确定要清空所有搜索历史吗？',
    }).then(() => {
      saveHistory([]);
    }).catch(() => {
      // 取消操作
    });
  };

  useEffect(()=>{
    setHotList()
  },[])

  // 只在查询与最后一次搜索查询匹配时显示建议列表
  const shouldShowSuggestions = query && query === lastSearchQuery;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <SearchBox 
          handleQuery={handleQuery} 
          onSearch={(query) => {
            addToHistory(query);
            setLastSearchQuery(query);
          }} 
        />
        
        {/* 搜索建议 */}
        {shouldShowSuggestions && (
          <div className={styles.list}>
            {
              suggestList.map((item, index) => (
                <div 
                  key={index} 
                  className={styles.item} 
                  onClick={() => {
                    setQuery(item);
                    addToHistory(item);
                    setLastSearchQuery(item);
                  }}
                >
                  {item}
                </div>
              ))
            }
          </div>
        )}
        
        {/* 历史记录 */}
        {historyList.length > 0 && !query && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h2>搜索历史</h2>
              <Delete className={styles.clearAllIcon} onClick={clearAllHistory} />
            </div>
            <div className={styles.historyList}>
              {historyList.map((keyword, index) => (
                <HistoryItem 
                  key={index} 
                  keyword={keyword} 
                  onDelete={deleteHistoryItem} 
                />
              ))}
            </div>
          </div>
        )}
        
        {/* 热门搜索 */}
        {!query && (
          <HotListItems hotList={hotList}/>
        )}
      </div>
    </div>
  )
}

export default SearchPage;