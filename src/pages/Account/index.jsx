import useTitle from '@/hooks/useTitle'
import {
  useState,
  useRef
} from 'react'
import {
  Image,
  Cell,
  CellGroup,
  ActionSheet,
  Toast
} from 'react-vant'
import {
  ServiceO,
  FriendsO,
  StarO,
  SettingO,
  AddO,
  CartO,
  ChatO,
  FireO,
  LikeO,
  Search,
  HomeO,
  UserO,
} from '@react-vant/icons'
import styles from './account.module.css'
import { useUser } from '@/contexts/UserContext'
import { useNavigate } from 'react-router-dom'

const Account = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const gridData = [
    { icon: <AddO />, text: '添加' },
    { icon: <CartO />, text: '购物车' },
    { icon: <ChatO />, text: '聊天' },
    { icon: <FireO />, text: '热门' },
    { icon: <LikeO />, text: '喜欢' },
    { icon: <StarO />, text: '收藏' },
    { icon: <Search />, text: '搜索' },
    { icon: <HomeO />, text: '首页' },
    { icon: <UserO />, text: '我的' }
  ];

  useTitle('我的账户')
  
  // 使用Context中的用户信息
  const { userInfo, updateAvatar } = useUser();
  const [showActionSheet, setShowActionSheet] = useState(false);
  
  const handleAction = async (e) => {
    console.log(e);
    if(e.type === 1){
      // AI生成头像
      navigate('/coze');
    } else if(e.type === 2){
      // 图片上传
      fileInputRef.current?.click();
      setShowActionSheet(false);
    }
  }
  
  // 处理文件选择后的上传逻辑
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      Toast.fail('请选择图片文件');
      return;
    }
    
    // 验证文件大小 (最大5MB)
    if (file.size > 5 * 1024 * 1024) {
      Toast.fail('图片大小不能超过5MB');
      return;
    }
    
    // 使用 FileReader 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result;
      if (typeof imageDataUrl === 'string') {
        updateAvatar(imageDataUrl);
        Toast.success('头像上传成功');
      }
    };
    
    reader.onerror = () => {
      Toast.fail('图片读取失败');
    };
    
    reader.readAsDataURL(file);
    
    // 清空文件输入框，以便下次选择同一文件也能触发change事件
    event.target.value = '';
  };
  
  const actions = [
    {
      name: 'AI生成头像',
      color: '#ee0a24',
      type: 1
    },
    {
      name: '上传头像',
      color: 'black',
      type: 2
    }
  ]
  
  return (
    <div className={styles.container}>
      {/* 隐藏的文件输入框 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <div className={styles.user}>
        <Image
          round
          width='64px'
          height='64px'
          src={userInfo.avatar}
          style={{ cursor: 'pointer' }}
          onClick={() => setShowActionSheet(true)}
        />
        <div className='ml4'>
          <div className={styles.nickname}>昵称:{userInfo.nickname}</div>
          <div className={styles.level}>等级:{userInfo.level}</div>
          <div className={styles.slogan}>签名:{userInfo.slogan}</div>
        </div>
      </div>
      <div className='mt3'>
        <CellGroup inset>
          <Cell title='服务' icon={<ServiceO />} isLink />
        </CellGroup>
        <CellGroup inset className='mt2'>
          <Cell title="收藏" icon={<StarO />} isLink />
          <Cell title="朋友圈" icon={<FriendsO />} isLink />
        </CellGroup>

        <CellGroup inset className='mt2'>
          <Cell title="设置" icon={<SettingO />} isLink />
        </CellGroup>
      </div>
      <ActionSheet 
        visible={showActionSheet}
        actions={actions}
        cancelText='取消'
        onCancel={() => setShowActionSheet(false)}
        onSelect={(e) => handleAction(e)}
        timeout={300}
      >
      </ActionSheet>
      <div className={styles.gridContainer}>
        {
          gridData.map((item,index) => (
            <div key={index} className={styles.gridItem}>
              <div className={styles.icon}>{item.icon}</div>
              <div className={styles.text}>{item.text}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Account