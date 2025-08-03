/**
 * chat 聊天
 * 
 */
const DEEPSEEK_CHAT_API_URL = 'https://api.deepseek.com/chat/completions';
const KIM_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';
const OPENAI_CHAT_API_URL = 'https://api.302.ai/v1/chat/completions';
// console.log(process.env.VITE_DEEPSEEK_API_KEY, '------');
export const chat = async (
    messages,
    api_url=DEEPSEEK_CHAT_API_URL,
    api_key=import.meta.env.VITE_DEEPSEEK_API_KEY,
    model='deepseek-chat',
) => {
    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify({
                model,
                messages,
                stream: false,
            })
        })
        const data = await response.json();
        return {
            code: 0,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content
            }
            
        }
    } catch(err) {
        return {
            code: 1,
            msg: '出错了...'
        }
   } 
}

export const kimChat = async (messages) => {
    const res = await chat(
        messages, 
        KIM_CHAT_API_URL, 
        import.meta.env.VITE_KIM_API_KEY, 
        'moonshot-v1-auto'
    )
    return res
}

export const openaiChat = async (messages) => { 
    const res = await chat(
        messages, 
        OPENAI_CHAT_API_URL, 
        import.meta.env.VITE_302_API_KEY, 
        'gpt-3.5-turbo'
    )
    return res
}

export const generateAvatar = async (text) => { 
    // 设计prompt
    const prompt = `
    Please create a 2D cartoon character avatar in the style of SpongeBob SquarePants based on the following user information:
  
User Nickname and Signature: ${text}

Design Requirements:
- Create an original cartoon character inspired by the user's nickname and signature
- Style: Bright, colorful 2D animation similar to SpongeBob SquarePants
- Character features:
  * Large expressive anime-style eyes
  * Simple yet cute facial design
  * Round and soft body shapes
  * Vivid color palette that reflects the user's personality
  * Friendly and approachable expression
  * Unique traits based on the nickname/signature (e.g., if nickname relates to fire, add flame elements)
- Technical specifications:
  * Front-facing view
  * Clean white or transparent background
  * Bold black outlines
  * Optimized for avatar use (clear facial features even at small sizes)
  * No text, watermarks, or additional elements
  * High quality, detailed illustration
- Overall feeling: Playful, energetic, and cartoonish like classic Nickelodeon style

Important: Create an original character design, do not copy existing characters. Focus on translating the user's identity into a cute cartoon avatar.
    `;
    
    try {
        // 通过代理调用豆包AI生成头像
        const response = await fetch('/api/doubao/bots/bot-gX4BRdXDgJ/image/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024"
            })
        });
        
        const result = await response.json();
        if (result.data && result.data.length > 0) {
            return result.data[0].url;
        } else {
            throw new Error('无法生成头像');
        }
    } catch (error) {
        console.error('头像生成失败:', error);
        throw error;
    }
}

export const consultantPrompt = `
你是点单小助手，专门帮助顾客点餐和推荐美食。请严格按照以下规则与顾客互动：

## 你的角色和能力：
1. 专业美食推荐师：了解各种地方菜系、特色菜品和口味搭配
2. 个性化点餐顾问：根据顾客口味偏好推荐合适菜品
3. 菜单解读专家：详细介绍菜品特色、口味和制作方式

## 你可以做的事情：
- 推荐地方特色菜系（如川菜、粤菜、湘菜、鲁菜等）
- 根据顾客口味偏好（辣、甜、咸、酸等）推荐菜品
- 介绍菜品的特色和制作方法
- 搭配推荐：主菜、配菜、汤品、饮品的组合建议
- 根据用餐场景（家庭聚餐、商务宴请、情侣约会等）推荐套餐
- 解答关于菜品口味、分量、食材的疑问
- 推荐适合特殊人群的菜品（如儿童、老人、减肥人士等）

## 严格禁止回答的问题：
- 算命、运势、占卜等迷信问题
- 天气、新闻、时事等无关话题
- 游戏、娱乐、电影等非餐饮内容
- 技术支持、系统故障等非业务问题
- 与点餐无关的闲聊话题

## 回答要求：
1. 语言亲切友好，像专业服务员一样热情
2. 回答简洁明了，重点突出菜品推荐
3. 避免使用过于复杂的专业术语
4. 主动询问顾客的口味偏好以提供更精准推荐
5. 当遇到禁止话题时，礼貌地引导回点餐主题

## 示例对话：
顾客：我想吃辣的
你：您好！我们有多种辣味菜品推荐。川菜系列的麻婆豆腐、水煮鱼、辣子鸡丁都是不错的选择。您比较喜欢麻辣、香辣还是酸辣口味呢？

顾客：有什么推荐的粤菜吗？
你：粤菜以清淡鲜美著称，推荐您尝试白切鸡、蜜汁叉烧、清蒸鲈鱼、虾饺等经典菜品。这些菜口味相对清淡，能品尝到食材的原汁原味。

请始终记住：你唯一的目标就是帮助顾客愉快地点餐，推荐最适合他们的美食！
`;