// src/pages/Coze/index.jsx
import styles from './coze.module.css'
import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { Toast } from 'react-vant'
import { useNavigate } from 'react-router-dom'

const Coze = () => { 
    const patToken = import.meta.env.VITE_PAT_TOKEN;
    const workflowUrl = 'https://api.coze.cn/v1/workflow/run';
    const workflow_id = '7534239430824919076';
    
    const navigate = useNavigate();

    // 获取用户上下文
    const { updateAvatar } = useUser();
    
    // coze需要的三个参数
    const [kind, setKind] = useState(0);
    const [hand, setHand] = useState(0);
    const [style, setStyle] = useState('写实');
    
    const [imgUrl, setImgUrl] = useState('');
    const [status, setStatus] = useState('');
    const [isGenerating, setIsGenerating] = useState(false); // 添加生成状态

    const generate = async () => {
        // 如果正在生成中，则不处理重复点击
        if (isGenerating) return;
        
        setStatus("正在生成...");
        setIsGenerating(true); // 设置生成状态为true
        
        const parameters = { 
            kind: kind, 
            hand: hand, 
            style: style
        };
        
        try {
            const res = await fetch(workflowUrl, {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer ${patToken}`, 
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ workflow_id, parameters, }),
            });
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const ret = await res.json();
            console.log(ret);

            if (ret.code !== 0) { 
                setStatus(ret.msg); 
                return; 
            }
            
            const data = JSON.parse(ret.data); 
            console.log(data);
            setStatus(''); 
            setImgUrl(data.data);
        } catch (error) {
            console.error('生成失败:', error);
            setStatus('生成失败: ' + error.message);
        } finally {
            setIsGenerating(false); // 无论成功或失败，都重置生成状态
        }
    }
    
    // 应用头像到Account页面
    const applyAvatar = () => {
        if (!imgUrl) {
            Toast.fail('请先生成图片');
            return;
        }
        updateAvatar(imgUrl);
        Toast.success('头像应用成功');
        navigate('/account');
    }

    return(
        <div className={styles.container}>
            <div className={styles.input}>
                <div className={styles.settings}>
                    <div className="selection">
                        <label>小猫种类：</label>
                        <select 
                            value={kind} 
                            onChange={(e) => {setKind(e.target.value)}}
                            disabled={isGenerating} // 生成过程中禁用选择器
                        >
                            <option value="0">三花猫</option>
                            <option value="1">橘猫</option>
                            <option value="2">银渐层猫</option>
                        </select>
                    </div>
                    
                    <div className={styles.selection}>
                        <label>持叉:</label>
                        <select 
                            value={hand} 
                            onChange={(e) => setHand(e.target.value)}
                            disabled={isGenerating} // 生成过程中禁用选择器
                        >
                            <option value="0">左手</option>
                            <option value="1">右手</option>
                        </select>
                    </div>
                    
                    <div className={styles.selection}>
                        <label>风格:</label>
                        <select 
                            value={style} 
                            onChange={(e) => setStyle(e.target.value)}
                            disabled={isGenerating} // 生成过程中禁用选择器
                        >
                            <option value="写实">写实</option>
                            <option value="乐高">乐高</option>
                            <option value="国漫">国漫</option>
                        </select>
                    </div>
                </div>
                
                <div className={styles.generate}>
                    <button 
                        onClick={generate} 
                        disabled={isGenerating} // 生成过程中禁用按钮
                    >
                        {isGenerating ? '生成中...' : '生成'}
                    </button>
                    {imgUrl && (
                        <button 
                            onClick={applyAvatar}
                            style={{ 
                                backgroundColor: '#28a745',
                                marginLeft: '10px'
                            }}
                            disabled={isGenerating} // 生成过程中禁用应用按钮
                        >
                            应用
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.output}>
                <div className={styles.generated}>
                    {imgUrl && <img src={imgUrl} alt="" />}
                    {status && <div className={styles.status}>{status}</div>}
                </div>
            </div>
        </div>
    )
}

export default Coze