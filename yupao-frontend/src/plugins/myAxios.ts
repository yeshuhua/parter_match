import axios from "axios";
import { showLoadingToast, closeToast } from "vant";

const myAxios = axios.create({
    // 请求地址基本路径
    baseURL: "http://localhost:8080/api",
    // 是否允许请求时携带
    withCredentials: true
})

// 添加请求拦截器
myAxios.interceptors.request.use((config) => {
    showLoadingToast({
        // 持续时间为0，不会自动关闭
        duration: 0,
        message: '加载中...',
        forbidClick: true,
    });
    // 在发送请求前要做什么
    return config
}, (error) => {
    // 请求错误要做什么
    return Promise.reject(error)
})

// 添加相应拦截器
myAxios.interceptors.response.use((response) => {
    closeToast();
    // if (response.data.code == 40100 || response.data.code == 40101) {
    //     window.location.href = `/user/login?redirect=${window.location.pathname}`
    // }
    // 对响应数据做点什么
    return response.data
}, (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
})

export default myAxios;