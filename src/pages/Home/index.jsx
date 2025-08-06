import useTitle from '@/hooks/useTitle'
import { useNavigate } from 'react-router-dom'
import { 
    Search, 
    Location, 
    ShopO, 
    CouponO, 
    GiftO, 
    MedalO, 
    Bell 
} from '@react-vant/icons'
import styles from './home.module.css'
import Swiper from '@/components/Swiper'
import { showToast } from '@/components/Toast/toastController'
import { useState, useCallback } from 'react'
import { Toast } from 'react-vant'


const Home = () => {
    useTitle('首页')
    const navigate = useNavigate()
    const [location, setLocation] = useState('浙江温州')
    const [isLocating, setIsLocating] = useState(false)
    
    // 获取定位函数 - 绑定到Location图标
    const getLocation = useCallback(async () => {
        if (isLocating) return;
        
        setIsLocating(true);
        Toast('定位中...');
        
        try {
            // 替换为你的高德地图API Key
            const key = import.meta.env.VITE_AMAP_KEY;
            
            const response = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
            const data = await response.json();
            
            if (data.status === '1') {
                // 处理直辖市（如北京市）
                const isMunicipality = data.province === data.city;
                const province = data.province.replace(/省|市|自治区|特别行政区/g, '');
                const city = data.city.replace(/市|地区|自治州|盟|县/g, '');
                
                // 直辖市只显示市名（如"北京"）
                const locationText = isMunicipality ? city : `${province}${city}`;
                
                setLocation(locationText);
                Toast('定位成功')
            } else {
                // 更详细的错误处理
                let errorMessage = '定位失败';
                if (data.info === 'INVALID_USER_KEY') {
                    errorMessage = 'API Key无效，请检查配置';
                } else if (data.info === 'DAILY_QUERY_OVER_LIMIT') {
                    errorMessage = 'API调用超限额';
                } else if (data.info) {
                    errorMessage = data.info;
                }
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('定位错误详情:', error);
            showToast('error', error.message || '定位服务异常');
        } finally {
            setIsLocating(false);
        }
    }, [isLocating])
    
    // 模拟推荐商品数据
    const recommendProducts = [
        { id: 1, name: '椰云拿铁', price: 32, image: '/yeyun.png', sold: 200 },
        { id: 2, name: '生椰拿铁', price: 28, image: '/shengye.png', sold: 350 },
        { id: 3, name: '陨石拿铁', price: 30, image: '/yunshi.png', sold: 280 },
        { id: 4, name: '丝绒拿铁', price: 34, image: '/sirong.png', sold: 420 },
    ]
    
    // 模拟功能菜单
    const menuItems = [
        { icon: <ShopO />, title: '商家', path: '/detail/123' },
        { icon: <CouponO />, title: '优惠券', path: '/home' },
        { icon: <GiftO />, title: '礼品卡', path: '/home' },
        { icon: <MedalO />, title: '会员', path: '/account' },
    ]
    
    // 模拟商家数据
    const shops = [
        { id: 1, name: '瑞幸咖啡', rating: 4.8, deliveryTime: '30分钟', distance: '500m', image: '/coffee.png' },
        { id: 2, name: '星巴克', rating: 4.7, deliveryTime: '40分钟', distance: '1.2km', image: '/startbuck.png' },
        { id: 3, name: '麦当劳', rating: 4.6, deliveryTime: '25分钟', distance: '800m', image: '/mac.png' },
    ]

    return (
        <div className={styles.container}>
            {/* 顶部搜索栏 */}
            <div className={styles.header}>
                {/* 定位功能移动到Location图标区域 */}
                <div 
                    className={styles.location}
                    onClick={getLocation}  // 将定位功能移到这里
                >
                    <Location />
                    <span>{location}</span>
                    {isLocating && <div className={styles.loadingIndicator}></div>}
                </div>
                
                <div 
                    className={styles.searchBox}
                    onClick={() => navigate('/search')}
                >
                    <Search />
                    <span>搜索商家、商品</span>
                </div>
                
                {/* Bell图标恢复原始功能 */}
                <div 
                    className={styles.bellIcon}
                    onClick={() => showToast(1, 2, 3)}  // 还原原始功能
                >
                    <Bell />
                </div>
            </div>

            {/* 功能菜单 */}
            <div className={styles.menuGrid}>
                {menuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className={styles.menuItem}
                        onClick={() => navigate(item.path)}
                    >
                        <div className={styles.menuIcon}>{item.icon}</div>
                        <div className={styles.menuTitle}>{item.title}</div>
                    </div>
                ))}
            </div>

            {/* 轮播图 */}
            <Swiper />

            {/* 推荐商品 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>热门推荐</h2>
                </div>
                <div className={styles.productList}>
                    {recommendProducts.map(product => (
                        <div 
                            key={product.id} 
                            className={styles.productItem}
                            onClick={() => navigate('/detail/123')}
                        >
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                            <div className={styles.productInfo}>
                                <div className={styles.productName}>{product.name}</div>
                                <div className={styles.productSales}>月售{product.sold}</div>
                                <div className={styles.productPrice}>¥{product.price}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 推荐商家 */}
            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>附近商家</h2>
                </div>
                <div className={styles.shopList}>
                    {shops.map(shop => (
                        <div 
                            key={shop.id} 
                            className={styles.shopItem}
                            onClick={() => navigate('/detail/123')}
                        >
                            <img src={shop.image} alt={shop.name} className={styles.shopImage} />
                            <div className={styles.shopInfo}>
                                <div className={styles.shopName}>{shop.name}</div>
                                <div className={styles.shopRating}>
                                    <span>★</span> {shop.rating} | {shop.deliveryTime} | {shop.distance}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home