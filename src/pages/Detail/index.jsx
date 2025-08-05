import useTitle from "@/hooks/useTitle"
import useDetailStore from "@/store/useDeatilStore"
import useCartStore from "@/store/cartStore"
import {
    Skeleton,
    Toast,
} from "react-vant"
import { 
    useEffect, 
    useState, 
    useRef, 
} from "react"
import styles from './detail.module.css'
import { ShoppingCartO } from '@react-vant/icons'
import { useNavigate } from "react-router-dom"

const Detail = () => {
    useTitle("详情")
    const { loading, detail, setDetail } = useDetailStore()
    const { 
      cartItems, 
      totalPrice, 
      deliveryFee, 
      deliveryThreshold,
      addToCart,
      updateQuantity,
      getTotalQuantity,
      isCrossDeliveryThreshold
    } = useCartStore() // 使用购物车 store

    const navigate = useNavigate()
    
    const [uiData, setUIData] = useState(null)
    const [activeMenu, setActiveMenu] = useState(0)
    const [flyingItems, setFlyingItems] = useState([])
    const goodsListRef = useRef(null)
    const uiDataRef = useRef(null)
    const cartIconRef = useRef(null)

    // 菜单分类
    const menuCategories = [
        { id: 0, name: '推荐' },
        { id: 1, name: '热销' },
        { id: 2, name: '折扣' },
        { id: 3, name: '进店必喝' },
        { id: 4, name: '只喝冰美' },
        { id: 5, name: '新品' },
        { id: 6, name: '季节限定' }
    ]
    
    useEffect(() => {
        if (!loading && detail) {
            const data = new UIData(detail)
            // 同步购物车状态到本地UI状态
            cartItems.forEach(cartItem => {
                if (data.uiGoods[cartItem.id]) {
                    // 更新商品数量
                    data.uiGoods[cartItem.id].choose = cartItem.quantity
                }
            })
            setUIData(data)
            uiDataRef.current = data
        }
    }, [loading, detail, cartItems])
    useEffect(() => {
        setDetail()
    },[])
    
    // 商品数据
    class UIGoods {
        constructor(g) {
            this.data = g
            this.choose = 0
        }
        // 总价
        getTotalPrice() {
            return this.data.price * this.choose
        }
        // 选中商品
        isChoose() {
            return this.choose > 0
        }
        // +1
        increase() {
            this.choose++
        }
        // -1   
        decrease() {
            if (this.choose > 0) {
                this.choose--
            }
        }
    }

    // 界面数据
    class UIData {
        constructor(goods) {
            let uiGoods = []
            for (let i = 0; i < goods.length; i++) {
                uiGoods.push(new UIGoods(goods[i]))
            }
            this.uiGoods = uiGoods
            this.deliveryThreshold = 30
            this.deliveryPrice = 5
        }
        getTotalPrice(){
            let sum = 0
            this.uiGoods.forEach(element => {
                sum += element.getTotalPrice()
            })
            return sum
        }
        // 增/减商品数量
        increase(index){
            this.uiGoods[index].increase()
        }
        decrease(index){
            this.uiGoods[index].decrease()
        }
        // 总共选中商品数量
        getTotalChooseNumber(){
            let sum = 0
            this.uiGoods.forEach(element => {
                sum += element.choose
            })
            return sum
        }
        // 购物车有没有东西
        hasGoodsInCar(){
            return this.uiGoods.some(element => element.choose > 0)
        }
        // 钱够配送
        isCrossDeliveryThreshold(){
            return this.getTotalPrice() >= this.deliveryThreshold
        }
    }

    // 抛物线动画
    const createFlyingItem = (startPos, endPos) => {
        const id = Date.now() + Math.random()
        const newItem = {
            id,
            startX: startPos.x,
            startY: startPos.y,
            endX: endPos.x,
            endY: endPos.y,
            progress: 0
        }

        setFlyingItems(prev => [...prev, newItem])

        // 动画过程
        const startTime = Date.now()
        const duration = 800

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            
            setFlyingItems(prev => 
                prev.map(item => 
                    item.id === id 
                        ? { ...item, progress } 
                        : item
                )
            )

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                // 移除动画
                setTimeout(() => {
                    setFlyingItems(prev => prev.filter(item => item.id !== id))
                }, 100)
            }
        }

        requestAnimationFrame(animate)
    }

    // 获取元素位置
    const getElementPosition = (element) => {
        const rect = element.getBoundingClientRect()
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        }
    }

    // 处理增加商品数量
    const handleIncrease = (index, event) => {
        if (uiDataRef.current) {
            // 获取点击按钮的位置
            const button = event.target
            const startPos = getElementPosition(button)

            // 获取购物车图标的位置
            const cartIcon = document.querySelector(`.${styles.cartIconWrapper}`)
            const endPos = cartIcon ? getElementPosition(cartIcon) : { x: window.innerWidth / 2, y: window.innerHeight - 40 }

            // 抛物线动画
            createFlyingItem(startPos, endPos)

            // 购物车动画
            carAnimate()

            // 更新数据到购物车 store
            const goods = uiDataRef.current.uiGoods[index]
            addToCart({
                id: index,
                name: goods.data.title,
                price: goods.data.price,
                pic: goods.data.pic
            })

            // 更新本地数据
            uiDataRef.current.increase(index)
            setUIData({...uiDataRef.current})
        }
    }


    // 处理减少商品数量
    const handleDecrease = (index) => {
        if (uiDataRef.current && uiDataRef.current.uiGoods[index].choose > 0) {
            // 更新购物车 store
            const goods = uiDataRef.current.uiGoods[index]
            const newQuantity = goods.choose - 1
            updateQuantity(index, newQuantity)

            // 更新本地数据
            uiDataRef.current.decrease(index)
            setUIData({...uiDataRef.current})
        }
    }
    // 处理按钮事件
    const handleCheckout = () => {
        if (uiDataRef.current) {
            if (getTotalQuantity() === 0) {
                Toast('购物车为空')
                return
            }
            
            if (!isCrossDeliveryThreshold()) {
                const diff = deliveryThreshold - totalPrice
                Toast(`还差¥${diff.toFixed(2)}起送`)
                return
            }
            // 结算转页面
            navigate('/pay')
        }
    }

    if (loading) return <Skeleton title />

    // 计算购物车总数量
    const getTotalCount = () => {
        if (!uiDataRef.current) return 0
        return uiDataRef.current.getTotalChooseNumber()
    }
    
    // 计算总支付金额（包含配送费）
    const getTotalPayment = () => {
        if (totalPrice <= 0) return 0
        return isCrossDeliveryThreshold() ? totalPrice + deliveryFee : totalPrice
    }

    // 添加购物车动画方法
    const carAnimate = () => {
      if (cartIconRef.current) {
        cartIconRef.current.classList.add(styles.animate)
        setTimeout(() => {
          if (cartIconRef.current) {
            cartIconRef.current.classList.remove(styles.animate)
          }
        }, 800)
      }
    }
    
    return (
        <div className={styles.container}>
            {/* 左侧菜单 */}
            <div className={styles.menu}>
                {menuCategories.map((category) => (
                    <div 
                        key={category.id}
                        className={`${styles.menuItem} ${activeMenu === category.id ? styles.active : ''}`}
                        onClick={() => setActiveMenu(category.id)}
                    >
                        {category.name}
                    </div>
                ))}
            </div>

            {/* 右侧商品列表 */}
            <div className={styles.goodsList} ref={goodsListRef}>
                {uiDataRef.current && uiDataRef.current.uiGoods.map((goods, index) => (
                    <div className={styles.goodsItem} key={index}>
                        <div className={styles.goodsImg}>
                            <img src={goods.data.pic} alt={goods.data.title} />
                        </div>
                        <div className={styles.goodsInfo}>
                            <h2 className={styles.goodsName}>{goods.data.title}</h2>
                            <p className={styles.goodsDesc}>{goods.data.desc}</p>
                            <p className={styles.goodsSell}>
                                <span>月售{goods.data.sellNumber}</span>
                                <span>好评率{goods.data.favorRate}%</span>
                            </p>
                            <div className={styles.goodsConfirm}>
                                <p className={styles.goodsPrice}>
                                    <span>¥</span>
                                    <span>{goods.data.price}</span>
                                </p>
                                <div className={styles.goodsBtns}>
                                    {goods.choose > 0 && (
                                        <div 
                                            className={styles.btnDecrease}
                                            onClick={() => handleDecrease(index)}
                                        >
                                            -
                                        </div>
                                    )}
                                    {goods.choose > 0 && (
                                        <span className={styles.goodsCount}>{goods.choose}</span>
                                    )}
                                    <div 
                                        className={styles.btnIncrease}
                                        onClick={(e) => handleIncrease(index, e)}
                                    >
                                        +
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 底部购物车 */}
            <div className={styles.footer}>
                <div className={styles.cartWrapper}>
                    <div className={styles.cartIconWrapper} ref={cartIconRef}>
                        <ShoppingCartO className={styles.cartIcon} />
                        {getTotalCount() > 0 && (
                            <div className={styles.cartCount}>
                                {getTotalCount()}
                            </div>
                        )}
                    </div>
                    <div className={styles.cartInfo}>
                        <div className={styles.cartTotal}>
                            ¥{uiDataRef.current ? getTotalPayment() : 0}
                            {uiDataRef.current && uiDataRef.current.getTotalPrice() > 0 && uiDataRef.current.isCrossDeliveryThreshold() && (
                                <span className={styles.deliveryFee}></span>
                            )}
                        </div>
                        <div className={styles.cartDelivery}>
                            {uiDataRef.current && uiDataRef.current.getTotalPrice() > 0 
                                ? (uiDataRef.current.isCrossDeliveryThreshold() 
                                    ? '配送费¥' + uiDataRef.current.deliveryPrice 
                                    : `还差¥${(uiDataRef.current.deliveryThreshold - uiDataRef.current.getTotalPrice()).toFixed(2)}起送`)
                                : `满¥${uiDataRef.current?.deliveryThreshold || 30}起送`
                            }
                        </div>
                    </div>
                </div>
                <button 
                    className={`${styles.checkoutBtn} ${!uiDataRef.current || !uiDataRef.current.hasGoodsInCar() ? styles.disabled : ''}`}
                    disabled={!uiDataRef.current || !uiDataRef.current.hasGoodsInCar()}
                    onClick={handleCheckout}
                >
                    {uiDataRef.current && uiDataRef.current.hasGoodsInCar() ? '去结算' : '购物车为空'}
                </button>
            </div>

            {/* 抛物线动画元素 */}
            {flyingItems.map(item => {
                const currentX = item.startX + (item.endX - item.startX) * item.progress
                const currentY = item.startY + (item.endY - item.startY) * item.progress - 
                                100 * Math.sin(Math.PI * item.progress) // 添加抛物线效果
                
                return (
                    <div
                        key={item.id}
                        className={styles.flyingItem}
                        style={{
                            left: currentX - 10,
                            top: currentY - 10,
                            opacity: 1 - item.progress
                        }}
                    />
                )
            })}
        </div>
    )
}

export default Detail