<template>
    <van-cell title="个人信息"
              is-link
              to="/user/profile" />
    <van-cell title="创建的队伍"
              is-link
              to="/user/team/create" />
    <van-cell title="加入的队伍"
              is-link
              to="/user/team/join" />
    <van-button type="primary"
                size="large"
                class="btn"
                @click="doClick()">{{ title }}</van-button>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog, showSuccessToast, showFailToast } from 'vant';
import { getIsLogin, removeIsLogin, removeCurrentUserState } from '../globals/user';
import myAxios from '../plugins/myAxios';
const router = useRouter();
const isLogin = ref(false);
onMounted(() => {
    isLogin.value = !(!getIsLogin() || getIsLogin() === 'off')
})
const title = computed(() => {
    return isLogin.value ? '登出' : '登录'
})

const doClick = () => {
    if (isLogin.value) {
        showConfirmDialog({
            message:
                '是否确认退出当前用户？',
        })
            .then(async () => {
                // on confirm
                const res = await myAxios.post('/user/logout');
                if (res.code == 0) {
                    showSuccessToast('退出成功');
                    // 清空本地存储中用户信息
                    removeIsLogin();
                    removeCurrentUserState();
                    isLogin.value = false;
                    return
                }
                showFailToast('当前用户退出失败，请稍后重试')
            })
            .catch(() => {
                // on cancel
            });
    } else {
        router.replace('/user/login')
    }
}
</script>

<style scoped>
.btn {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>