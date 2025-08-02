import { Link } from 'react-router-dom';
import useTitle from '@/hooks/useTitle'

function NotFound() {
  useTitle('404 - 页面未找到')
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - 页面未找到</h1>
      <p>抱歉，您访问的页面不存在。</p>
      <Link to="/home">返回首页</Link>
    </div>
  );
}

export default NotFound;