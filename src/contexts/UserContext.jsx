// src/contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 默认用户信息
  const defaultUserInfo = {
    nickname: '海底火旺',
    level: '5级',
    slogan: '保持优秀👍',
    avatar: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F04a5f090-816d-44f8-ac92-09a58d3fb8c0%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1756039300&t=73dea4c6b60bd98a6759122046a424c9'
  };

  // 从本地存储中获取用户信息，如果不存在则使用默认值
  const getUserInfoFromStorage = () => {
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      return storedUserInfo ? JSON.parse(storedUserInfo) : defaultUserInfo;
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return defaultUserInfo;
    }
  };

  const [userInfo, setUserInfo] = useState(getUserInfoFromStorage);

  // 本地存储
  useEffect(() => {
    try {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('保存用户信息失败:', error);
    }
  }, [userInfo]);

  const updateAvatar = (newAvatarUrl) => {
    setUserInfo(prev => ({
      ...prev,
      avatar: newAvatarUrl
    }));
  };

  // 重置用户信息到默认值
  const resetUserInfo = () => {
    setUserInfo(defaultUserInfo);
  };

  return (
    <UserContext.Provider value={{ userInfo, updateAvatar, resetUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};