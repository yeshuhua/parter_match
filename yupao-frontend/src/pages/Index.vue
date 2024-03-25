<template>
  <van-cell center
            title="心动模式">
    <template #right-icon>
      <van-switch v-model="mode" />
    </template>
  </van-cell>
  <user-card-list :user-list="userList"
                  :loading="loading"></user-card-list>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import UserCardList from "../components/UserCardList.vue";
import { UserType } from "../models/user";
import myAxios from "../plugins/myAxios";

export default defineComponent({
  components: {
    'user-card-list': UserCardList
  },
  setup() {
    // 是否开启心动模式
    const mode = ref(false);
    const userList = ref([])
    // 骨架屏的加载动作
    const loading = ref(true);

    const doMatch = async () => {
      loading.value = true
      const res = await myAxios.get('/user/match', {
        params: {
          num: 10
        }
      })
      if (res.code == 0) {
        res.data.forEach((user: UserType) => {
          // 注意处理数组为空的情况
          user.tags = JSON.parse(user.tags || '[]');
        });
        userList.value = res.data
      }
      loading.value = false
    }

    const doRecommend = async () => {
      loading.value = true
      const res = await myAxios.get('/user/recommend', {
        params: {
          pageSize: 30,
          pageNum: 1
        }
      })

      if (res.code == 0) {
        res.data.forEach((user: UserType) => {
          user.tags = JSON.parse(user.tags || '[]');
        });
        userList.value = res.data
      }
      loading.value = false
    }
    watchEffect(() => {
      mode.value ? doMatch() : doRecommend()
    })
    return {
      userList,
      mode,
      loading
    }
  }
});
</script>


<style scoped></style>
