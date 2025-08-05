import {
    create
} from 'zustand'
import {
    getImages
} from '@/api/order'

const useImageStore = create((set,get)=>({
    images:[],
    page: 1,
    loading:false,
    fetchMore:async()=>{
        // 如果还在请求中，不再发起新的请求
        if(get().loading) return
        set({loading:true}) //请求中
        const res = await getImages(get().page)
        // console.log(res)
        // 之前的状态
        set((state) => ({
            images:[...state.images,...res.data],
            page:state.page+1,
            loading:false
        }))
    }
}))

export default useImageStore