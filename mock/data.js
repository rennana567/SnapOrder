import Mock from 'mockjs';

export default [{
    url: '/api/search',
    method: 'get',
    timeout: 1000,
    response: (req, res) => {
        // ?keyword=xxx
        const keyword = req.query.keyword;
        let num = Math.floor(Math.random() * 10);
        let list = [];
        for (let i = 0; i < num; i++) {
            // 随机内容
            const randomData = Mock.mock({
                title: '@ctitle'
            })
            console.log(randomData)
            list.push(`${randomData.title}${keyword}`)
        }

        return {
            code: 0,
            data: list
        }
    }
},
{
    url: '/api/hotlist',
    method: 'get',
    timeout: 1000,
    response: (req, res) => {
        return {
            code: 0,
            data: [{
                id: '101',
                city: "北京烤鸭"
            }, {
                id: '102',
                city: "上海生菜"
            }, {
                id: '103',
                city: "福州鱼丸"
            },]
        }
    }
},
{
    url: '/api/detail/123',
    method: 'get',
    timeout: 1000,
    response: (req, res) => {
        const randomData = [
            {
                pic: '/yeyun.png',
                title: '椰云拿铁',
                desc: `1人份【年度重磅】一口吞云】
    原创椰云topping，绵密轻盈到飞起！
    原创瑞幸椰云工艺，使用椰浆代替常规奶盖
    打造丰盈、绵密，如云朵般细腻奶沫体验
    椰香清甜饱满，一口滑入口腔
    
【饮用建议】请注意不要用吸管，不要搅拌哦~`,
                sellNumber: 200,
                favorRate: 95,
                price: 32,
            },
            {
                pic: '/shengye.png',
                title: '生椰拿铁',
                desc: `1人份【YYDS】无限回购】
    现萃香醇Espresso，遇见优质冷榨生椰浆，椰香浓郁，香甜清爽，带给你不一样的拿铁体验！
    
主要原料：浓缩咖啡、冷冻椰浆、原味调味糖浆
图片及包装仅供参考，请以实物为准。建议送达后尽快
饮用，到店饮用口感更佳。`,
                sellNumber: 350,
                favorRate: 97,
                price: 28,
            },
            {
                pic: '/yunshi.png',
                title: '陨石拿铁',
                desc: `1人份【黑糖风味】嚼着喝的咖啡】
    特调黑糖风味酱+寒天晶球组合
    现萃精醇咖啡搭配香浓牛乳
    底部黑糖挂壁，顶部绵密奶盖
    
【特色】首创可以"嚼"的咖啡体验
建议半小时内饮用，享受最佳口感`,
                sellNumber: 280,
                favorRate: 94,
                price: 30,
            },
            {
                pic: '/sirong.png',
                title: '丝绒拿铁',
                desc: `1人份【年度爆款】丝滑入喉】
    采用北海道丝绒工艺，打造天鹅绒般口感
    精选优质咖啡豆与牛乳完美配比
    入口绵密顺滑，回味醇香悠长
    
【冷热双享】热饮暖胃更暖心，冰饮清爽解腻
荣获2023年度咖啡金杯奖`,
                sellNumber: 420,
                favorRate: 98,
                price: 34,
            },
            {
                pic: '/houru.png',
                title: '厚乳拿铁',
                desc: `1人份【浓醇升级】奶香四溢】
    冷萃厚牛乳，乳蛋白含量高达6%
    现萃精醇咖啡与厚乳黄金比例融合
    三重口感层次：咖啡香→奶香→回甘
    
【推荐】冰饮更能体现厚乳的醇厚质感
最佳饮用温度：4℃-8℃`,
                sellNumber: 310,
                favorRate: 96,
                price: 33,
            }
        ]

        return {
            code: 0,
            data: randomData
        }
    }
},
{
    // ?page=1 queryString
    url: '/api/images',
    method: 'get',
    response:({query}) => {
        const page = Number(query.page) || 1
        return{
            code: 0,
            data: getImages(page)
        }
    }
}
]

// 每页10
const getImages = (page, pageSize=10) => {
    return Array.from({length:pageSize},(_,i) => ({
        // 索引唯一
        id: `${page}-${i}`,
        height: Mock.Random.integer(400,600),
        url: Mock.Random.image('300x400',Mock.Random.color(),'#fff','img')
    }))
}