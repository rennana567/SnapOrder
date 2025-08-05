// src/pages/Pay/index.jsx
import useTitle from "@/hooks/useTitle"
import { useState, useEffect } from "react"
import { Button, Toast, Loading } from "react-vant"
import { useNavigate } from "react-router-dom"
import useCartStore from "@/store/cartStore"
import styles from './pay.module.css'

const Pay = () => {
    useTitle("支付")
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(15 * 60) // 15分钟倒计时
    
    // 使用购物车 store
    const { 
      cartItems, 
      totalPrice, 
      deliveryFee, 
      deliveryThreshold,
      clearCart,
      isCrossDeliveryThreshold,
      getTotalWithDelivery
    } = useCartStore()

    // 倒计时效果
    useEffect(() => {
        if (countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // 格式化倒计时时间
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // 模拟支付处理
    const handlePay = () => {
        // 检查余额
        const totalAmount = getTotalWithDelivery()
        const walletBalance = 100 // 默认钱包余额
        
        if (totalAmount > walletBalance) {
            Toast.fail('余额不足')
            // 清空购物车并跳转回详情页
            setTimeout(() => {
                clearCart() // 清空购物车
                navigate('/detail/123')
            }, 500)
            return
        }
        
        setLoading(true)
        Toast.loading({ message: '支付处理中...', duration: 0 })
        
        // 模拟支付请求
        setTimeout(() => {
            setLoading(false)
            Toast.clear()
            Toast.success('支付成功')
            
            // 清空购物车
            clearCart()
            
            // 2秒后跳转到首页
            setTimeout(() => {
                navigate('/home', { replace: true })
            }, 2000)
        }, 2000)
    }

    // 订单信息
    const orderInfo = {
        orderId: "SN" + Date.now(),
        totalAmount: getTotalWithDelivery(),
        deliveryFee: isCrossDeliveryThreshold() ? deliveryFee : 0,
        items: cartItems,
        createTime: new Date().toLocaleString()
    }

    return (
        <div className={styles.container}>
            {/* 头部 */}
            <div className={styles.header}>
                <h2 className={styles.title}>确认支付</h2>
                <div className={styles.countdown}>
                    请在 <span className={styles.time}>{formatTime(countdown)}</span> 内完成支付
                </div>
            </div>

            {/* 订单信息 */}
            <div className={styles.orderInfo}>
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>订单信息</div>
                    <div className={styles.orderItem}>
                        <span>订单编号</span>
                        <span>{orderInfo.orderId}</span>
                    </div>
                    <div className={styles.orderItem}>
                        <span>下单时间</span>
                        <span>{orderInfo.createTime}</span>
                    </div>
                </div>

                {/* 商品列表 */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>商品信息</div>
                    {orderInfo.items.map((item, index) => (
                        <div className={styles.goodsItem} key={index}>
                            <div className={styles.goodsName}>
                                {item.name}
                                <span className={styles.quantity}>x{item.quantity}</span>
                            </div>
                            <div className={styles.goodsPrice}>¥{item.price}</div>
                        </div>
                    ))}
                </div>

                {/* 费用明细 */}
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>费用明细</div>
                    <div className={styles.feeItem}>
                        <span>商品总额</span>
                        <span>¥{totalPrice.toFixed(2)}</span>
                    </div>
                    {isCrossDeliveryThreshold() && (
                        <div className={styles.feeItem}>
                            <span>配送费</span>
                            <span>¥{deliveryFee}</span>
                        </div>
                    )}
                    <div className={styles.totalAmount}>
                        <span>合计</span>
                        <span className={styles.amount}>¥{orderInfo.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* 支付方式 */}
            <div className={styles.paymentMethods}>
                <div className={styles.sectionTitle}>选择支付方式</div>
                <div className={styles.paymentMethod}>
                    <div className={styles.paymentIcon}>
                        <div className={styles.walletIcon}></div>
                    </div>
                    <div className={styles.paymentInfo}>
                        <div className={styles.paymentName}>钱包支付</div>
                        <div className={styles.paymentDesc}>余额: ¥100.00</div>
                    </div>
                    <div className={styles.paymentCheck}></div>
                </div>
            </div>

            {/* 底部固定按钮 */}
            <div className={styles.footer}>
                <Button 
                    round 
                    block 
                    type="primary"
                    loading={loading}
                    disabled={countdown === 0}
                    onClick={handlePay}
                    className={styles.payButton}
                >
                    {countdown === 0 ? '支付超时' : `确认支付 ¥${orderInfo.totalAmount.toFixed(2)}`}
                </Button>
            </div>

            {/* 加载遮罩 */}
            {loading && (
                <div className={styles.loadingOverlay}>
                    <Loading type="spinner" size="50px" />
                    <div className={styles.loadingText}>支付处理中...</div>
                </div>
            )}
        </div>
    )
}

export default Pay