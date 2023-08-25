<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="userAccount"
                 name="userAccount"
                 label="用户账号"
                 placeholder="请输入用户名"
                 :rules="[{ required: true, message: '请填写账号' }]" />
      <van-field v-model="userPassword"
                 type="password"
                 name="userPassword"
                 label="密码"
                 placeholder="请输入密码"
                 :rules="[{ required: true, message: '请填写密码' }]" />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round
                  block
                  type="primary"
                  native-type="submit">
        登录
      </van-button>
    </div>
  </van-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import myAxios from "../plugins/myAxios";
import { useRouter, useRoute } from "vue-router";
import { showSuccessToast, showFailToast } from "vant";
import { setIsLogin } from "../globals/user";
// import { AxiosResponse } from "axios";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userAccount = ref("");
    const userPassword = ref("");
    const onSubmit = async () => {
      const res = await myAxios.post("/user/login", {
        userAccount: userAccount.value,
        userPassword: userPassword.value
      });
      if (res.code == 0) {
        setIsLogin("on");
        showSuccessToast("登录成功");
        // console.log(route);
        router.push({
          path: `${route.query.redirect}`,
          replace: true
        })
      } else {
        showFailToast("登录失败");
      }
    };
    return {
      userAccount,
      userPassword,
      onSubmit
    };
  }
});
</script>

<style scoped></style>
