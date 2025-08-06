import styles from './waterfall.module.css'
import { 
    useRef, 
    useEffect,
    useState,
} from 'react';
import ImageCard from '@/components/ImageCard'

const Waterfall = (props) => {
    const loader = useRef(null)
    const leftColumnRef = useRef(null)
    const rightColumnRef = useRef(null)
    const {
        loading,
        fetchMore,
        images
    } = props
    
    const [leftImages, setLeftImages] = useState([])
    const [rightImages, setRightImages] = useState([])
    
    useEffect(() => {
        if (!images || images.length === 0) {
            setLeftImages([])
            setRightImages([])
            return
        }
        
        const newLeftImages = []
        const newRightImages = []
        
        images.forEach((img, index) => {
            // 按高度分配图片
            if (index % 2 === 0) {
                newLeftImages.push(img)
            } else {
                newRightImages.push(img)
            }
        })
        
        setLeftImages(newLeftImages)
        setRightImages(newRightImages)
    }, [images])
    
    useEffect(() => {
        // ref 出现在视窗  intersectionObserver
        // 观察者模式
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading) {
                fetchMore()
            }
        })
        if (loader.current) observer.observe(loader.current)
        return () => observer.disconnect()
    }, [loading, fetchMore])

    return (
        <div className={styles.wrapper}>
            <div ref={leftColumnRef} className={styles.column}>
                {
                    leftImages.map(img => (
                        <ImageCard key={img.id} {...img} />
                    ))
                }
            </div>
            <div ref={rightColumnRef} className={styles.column}>
                {
                    rightImages.map(img => (
                        <ImageCard key={img.id} {...img} />
                    ))
                }
            </div>
            <div ref={loader} className={styles.loader}>加载中...</div>
        </div>
    )
};

export default Waterfall;