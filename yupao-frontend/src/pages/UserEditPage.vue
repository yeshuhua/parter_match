<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="editUser.currentValue" :name="editUser.editKey" :label="editUser.editName"
        :placeholder="`请填写${editUser.editName}`" />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showSuccessToast, showFailToast } from "vant";
import { getLoginUser, setCurrentUserState } from "../globals/user";
import myAxios from "../plugins/myAxios";
import { UserType } from "../models/user";

export default defineComponent({
  setup() {
    // 通过当前路径对象获取参数
    const route = useRoute();
    const router = useRouter();
    console.log(route.query);
    const editUser = ref({
      editKey: route.query.editKey,
      currentValue: route.query.currentValue,
      editName: route.query.editName
    });

    const onSubmit = async (values) => {
      const user = await getLoginUser();
      // 将editKey,currentValue,editName提交到后台
      const res = await myAxios.post("/user/update", {
        updateObj: [editUser.value.editKey, editUser.value.currentValue],
        // [editUser.value.editKey as string]: editUser.value.currentValue,
        id: user.id
      });
      if (res.code === 0) {
        showSuccessToast("修改成功");
        // 为了让跳回到信息页时获得最新的状态而不是本地存储中的状态，先把本地存储中的状态清空
        setCurrentUserState({} as UserType);
        router.back();
      } else {
        showFailToast("修改失败");
      }
    };
    return {
      editUser,
      onSubmit
    };
  }
});
</script>

<style scoped></style>
