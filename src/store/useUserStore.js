import {
  create
} from 'zustand'
import {
    doLogin
} from '@/api/user'

const getInitialLoginState = () => {
  try {
    const token = localStorage.getItem('token');
    return {
      user: null,
      isLogin: !!token  // 如果有 token 就认为已登录
    };
  } catch (error) {
    return {
      user: null,
      isLogin: false
    };
  }
};

export const useUserStore = create((set) => ({
  ...getInitialLoginState(), // 使用初始状态
  login:async ({username="",password=""}) => {
    const res = await doLogin({username,password})
    const {token,data:user} = res.data
    localStorage.setItem('token',token)
    set({
        user,
        isLogin:true
    })
  },
  logout:() => {
    localStorage.removeItem('token')
    set({
        user:null,
        isLogin:false
    })
  },
}))