// 通过爬虫获取用户数据
const axios = require('axios');
const Mappers = require('../services/cate/completion');
// 请求头之类的要同爬取的网站发送请求时的请求头一样

const crawelRequest = async () => {
    const res = await axios({
        // 请求头配置需要同爬取网站发送请求时携带的请求头相同
        url: "https://api.zsxq.com/v2/groups/51122858222824/topics?scope=questions&count=20",
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-request-id": "b1f1768e3-4a2e-60a2-6325-07954544381",
            "x-signature": "ec0b42b0960b74e568fae17b46eed643247ba354",
            "x-timestamp": "1688365793",
            "x-version": "2.39.0",
            "cookie": "sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2218850ef9e1330a-06b6d1278a91f1c-26031a51-904084-18850ef9e143d6%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E5%BC%95%E8%8D%90%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.code-nav.cn%2F%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMTg4NTBlZjllMTMzMGEtMDZiNmQxMjc4YTkxZjFjLTI2MDMxYTUxLTkwNDA4NC0xODg1MGVmOWUxNDNkNiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%22%2C%22value%22%3A%22%22%7D%2C%22%24device_id%22%3A%2218850ef9e1330a-06b6d1278a91f1c-26031a51-904084-18850ef9e143d6%22%7D; zsxq_access_token=9518C430-C4A2-407A-929F-32C22A2EBEAA_2F1C434642F7B04B; abtest_env=product; zsxqsessionid=2e2c2507654d15e0e9adeedbda8ab74e",
            "Referer": "https://wx.zsxq.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })

    // 处理一下得到可以插入到数据库中的数据
    const filterData = res.data.resp_data.topics.map(item => {
        // console.log(item);
        let temp = item.question.owner;
        return {
            id: temp.user_id,
            username: temp.name,
            avatarUrl: temp.avatar_url,
            // 默认不为空，这里都设置为一样的
            userPassword: 123456
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


