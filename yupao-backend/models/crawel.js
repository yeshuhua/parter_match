// 通过爬虫获取用户数据
const axios = require('axios');
// 加密库
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const Mappers = require('../services/cate/completion');
const userdata = require('./users.json');
// 请求头之类的要同爬取的网站发送请求时的请求头一样

const crawelRequest = async () => {
    const res = await axios({
        // 请求头配置需要同爬取网站发送请求时携带的请求头相同
        url: "https://api.zsxq.com/v2/groups/51122858222824/topics/tasks?enabled=true&count=9&end_time=",
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-request-id": "ccf9dc809-29d9-fcb9-c649-487eb9d0435",
            "x-signature": "c6e44e1cea37ca64d412b96a26e5c1c89cf07696",
            "x-timestamp": "1710685147",
            "x-version": "2.51.0",
            "cookie": "zsxq_access_token=106D3A50-48ED-9BEF-BAD3-B51EC971C107_2F1C434642F7B04B; abtest_env=product; zsxqsessionid=c0aac26dd49ea4e7fcb4ee2a74853c23; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22184221144222442%22%2C%22first_id%22%3A%2218a10ed9e99267-030b4ebb3de01d4-26031f51-904084-18a10ed9e9a758%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMThhMTBlZDllOTkyNjctMDMwYjRlYmIzZGUwMWQ0LTI2MDMxZjUxLTkwNDA4NC0xOGExMGVkOWU5YTc1OCIsIiRpZGVudGl0eV9sb2dpbl9pZCI6IjE4NDIyMTE0NDIyMjQ0MiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%22184221144222442%22%7D%2C%22%24device_id%22%3A%2218a10ed9e99267-030b4ebb3de01d4-26031f51-904084-18a10ed9e9a758%22%7D",
            "Referer": "https://wx.zsxq.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })

    // 处理一下得到可以插入到数据库中的数据
    const filterData = res.data.resp_data.topics.map(item => {
        // console.log(item);
        let temp = item.question?.owner;
        return {
            id: temp?.user_id,
            username: temp?.name,
            avatarUrl: temp?.avatar_url,
            // 默认不为空，这里都设置为一样的
            userPassword: bcrypt.hashSync('12345678', salt)
        }
    })
    return filterData
}
(async () => {
    const userList = await crawelRequest();
    // console.log(userList);
    // 往数据库中批量插入数据
    // 去重
    const temp = new Map();
    // 1，过滤方法
    const tempArray = userList.filter(item => {
        if (item.id === undefined) return false;
        return !temp.has(item.id) && temp.set(item.id, 1)
    })
    // 2.过滤方法，reduce方法的第二个参数为acc的初始值
    // const tempArray = userList.reduce((acc, current) => {
    //     if (!acc.find(item => item.id === current.id)) {
    //         acc.push(current)
    //     }
    //     return acc
    // }, [])
    // console.log(tempArray);
    Mappers.User.userAddMany(tempArray);
})()


