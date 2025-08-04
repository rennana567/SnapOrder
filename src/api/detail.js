import axios from './config'

export const getDetail = async ()=>{
    return axios.get(`/detail/123`);
}