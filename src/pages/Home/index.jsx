// src/pages/Home/index.jsx
import useTitle from '@/hooks/useTitle'
import { useNavigate } from 'react-router-dom'
import { Search, LocationO, ShopO, CouponO, GiftO, MedalO } from '@react-vant/icons'
import styles from './home.module.css'
import Swiper from '@/components/Swiper'

const Home = () => {
    useTitle('首页')
    const navigate = useNavigate()
    
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
                <div className={styles.location}>
                    <LocationO />
                    <span>浙江温州江南皮革厂</span>
                </div>
                <div 
                    className={styles.searchBox}
                    onClick={() => navigate('/search')}
                >
                    <Search />
                    <span>搜索商家、商品</span>
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