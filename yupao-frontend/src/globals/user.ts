import { UserType } from "../models/user"
import myAxios from "../plugins/myAxios"
import { showFailToast, showSuccessToast } from 'vant'
import { AxiosResponse } from "axios"

// 获取当前用户是否登录态
export const getIsLogin = () => {
    return window.localStorage.getItem('isLogin') || null
}

// 设置当前用户是否登录态
export const setIsLogin = (state: string) => {
    window.localStorage.setItem('isLogin', state)
}

export const removeIsLogin = () => {
    window.localStorage.removeItem('isLogin');
}

// 获取当前用户信息
export const getCurrentUserState = () => {
    return JSON.parse(window.localStorage.getItem('CURRENT') || "{}")
}

// 设置当前用户信息
export const setCurrentUserState = (user: UserType) => {
    window.localStorage.setItem('CURRENT', JSON.stringify(user))
}

export const removeCurrentUserState = () => {
    window.localStorage.removeItem('CURRENT');
}

// 因为在很多地方都要用到当前用户信息，
// 所以封装成一个函数。已登录则返回用户信息，未登录则发请求登录
export const getLoginUser = async () => {
    // if (JSON.stringify(getCurrentUserState()) !== "{}") {
    //     return getCurrentUserState()
    // }
    if (!getIsLogin() || getIsLogin() === 'off') {
        showFailToast({
            message: '未登录',
            duration: 1500
        })
        return false
    }
    const res: AxiosResponse = await myAxios.get("/user/current");
    // console.log(res);
    if (res.code === 0) {
        setCurrentUserState(res.data)
        showSuccessToast("获取用户信息成功");
    } else {
        showFailToast("获取用户信息失败");
    }
    return res.data
}