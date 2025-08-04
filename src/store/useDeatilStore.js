import {
    create
} from 'zustand'
import { getDetail } from '@/api/detail'
const useDetailStore = create((set) => ({
    detail:[],
    loading:false,
    setDetail:async()=>{
        set({loading:true})
        const res = await getDetail()
        set({
            loading:false,
            detail:res.data
        })
    }
}))

export default useDetailStore