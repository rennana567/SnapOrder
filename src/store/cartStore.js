// src/store/cartStore.js
import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  cartItems: [],
  totalPrice: 0,
  deliveryFee: 5,
  deliveryThreshold: 30,
  
  // 添加商品到购物车
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id)
      let newCartItems
      
      if (existingItem) {
        newCartItems = state.cartItems.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        newCartItems = [...state.cartItems, { ...item, quantity: 1 }]
      }
      
      const totalPrice = newCartItems.reduce((sum, cartItem) => 
        sum + (cartItem.price * cartItem.quantity), 0)
      
      return { 
        cartItems: newCartItems,
        totalPrice 
      }
    })
  },
  
  // 更新商品数量
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      set((state) => {
        const newCartItems = state.cartItems.filter(item => item.id !== itemId)
        const totalPrice = newCartItems.reduce((sum, cartItem) => 
          sum + (cartItem.price * cartItem.quantity), 0)
        return { cartItems: newCartItems, totalPrice }
      })
      return
    }
    
    set((state) => {
      const newCartItems = state.cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      const totalPrice = newCartItems.reduce((sum, cartItem) => 
        sum + (cartItem.price * cartItem.quantity), 0)
      return { cartItems: newCartItems, totalPrice }
    })
  },
  
  // 清空购物车
  clearCart: () => {
    set({ cartItems: [], totalPrice: 0 })
  },
  
  // 获取购物车总数量
  getTotalQuantity: () => {
    return get().cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },
  
  // 检查是否达到配送门槛
  isCrossDeliveryThreshold: () => {
    return get().totalPrice >= get().deliveryThreshold
  },
  
  // 获取包含配送费的总金额
  getTotalWithDelivery: () => {
    const { totalPrice, deliveryFee, isCrossDeliveryThreshold } = get()
    return isCrossDeliveryThreshold() ? totalPrice + deliveryFee : totalPrice
  }
}))

export default useCartStore