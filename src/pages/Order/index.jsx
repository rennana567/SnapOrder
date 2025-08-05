import styles from './order.module.css';
import useImageStore from '@/store/useImageStore.js';
import {
  useEffect
} from 'react';
import useTitle from '@/hooks/useTitle';
import Waterfall from '@/components/Waterfall';

const Order = () => {
  const { loading,images,fetchMore } = useImageStore();

  useEffect(() => {
    fetchMore();
    useTitle('购物');
  }, [])
  
  return (
    <>
      <Waterfall images={images} loading={loading} fetchMore={fetchMore} />
    </>
  )
}
export default Order;