import Mock from 'mockjs';

export default [{
    url: '/api/search',
    method: 'get',
    timeout: 1000,
    response:(req, res) => {
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
            data:[{
                id: '101',
                city: "北京烤鸭"
            },{
                id: '102',
                city: "上海生菜"
            }, {
                id: '103',
                city: "福州鱼丸"
            },]
        }
    }
}
]