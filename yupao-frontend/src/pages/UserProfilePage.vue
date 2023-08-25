<template>
  <template v-if="user">
    <van-cell title="昵称"
              is-link
              to="/user/edit"
              :value="user.username"
              @click="toEdit('username', '昵称', user.username)" />
    <van-cell title="账号"
              is-link
              :value="user.userAccount" />
    <van-cell title="头像"
              is-link
              to="/user/edit"
              @click="toEdit('avatarUrl', '头像', user.avatarUrl)">
      <img :src="user.avatarUrl"
           style="height: 48px" />
    </van-cell>
    <van-cell title="性别"
              is-link
              to="/user/edit"
              :value="user.gender"
              @click="toEdit('gender', '性别', user.gender)" />
    <van-cell title="电话"
              is-link
              to="/user/edit"
              :value="user.phone"
              @click="toEdit('phone', '电话', user.phone)" />
    <van-cell title="邮箱"
              is-link
              to="/user/edit"
              :value="user.email"
              @click="toEdit('email', '邮箱', user.email)" />
    <van-cell title="星球编号"
              is-link
              :value="user.planetCode" />
    <van-cell title="注册时间"
              is-link
              :value="user.createTime" />
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getLoginUser } from "../globals/user";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    // const user = {
    //   id: 1,
    //   username: "老摊",
    //   userAccount: "dogyupi",
    //   avatarUrl:
    //     "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKvgv8jHBiabwvlrQgtxcGnWbdWmZyqBibSF9w2icJs0xHyztYo1spzxeAVX1Av7oICYzCwLMZQYJl6w/132",
    //   gender: "男",
    //   phone: "12345678901",
    //   email: "123456@qq.com",
    //   planetCode: "123",
    //   createTime: new Date()
    // };
    const user = ref();
    const toEdit = (
      editKey: string,
      editName: string,
      currentValue: string
    ) => {
      // 编程导航到用户编辑页面
      router.push({
        path: "/user/edit",
        query: {
          editKey,
          editName,
          currentValue
        }
      });
    };
    onMounted(async () => {
      const result = await getLoginUser();
      if (!result) {
        router.push({
          path: '/user/login',
          query: {
            redirect: route.path
          },
          replace: true
        })
      }
      user.value = result;
    });
    return {
      user,
      toEdit
    };
  }
});
</script>

<style scoped></style>
