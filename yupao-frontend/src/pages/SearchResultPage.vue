<template>
  <user-card-list :user-list="userList"></user-card-list>
  <van-empty v-if="!userList || userList.length === 0" image="search" description="搜索结果为空" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import myAxios from "../plugins/myAxios";
import UserCardList from "../components/UserCardList.vue";
// @ts-ignore
import qs from "qs";

export default defineComponent({
  components: {
    "user-card-list": UserCardList
  },
  setup() {
    const route = useRoute();
    const { tags } = route.query;
    const userList = ref([]);
    // 生命周期钩子，发送请求
    onMounted(async () => {
      const res = await myAxios.get("/user/search/tags", {
        params: {
          tagNameList: tags // tags为数组，需要序列化
        },
        // `paramsSerializer` is an optional config in charge of serializing `params`
        // 指定urlSearchParams参数的序列化方式
        paramsSerializer: (params) => {
          return qs.stringify(params, { indices: false });
        }
      });
      console.log(res);

      if (res.code == 0) {
        userList.value = res.data;
        console.log(res.data);
      }
    });

    return {
      userList
    };
  }
});
</script>

<style scoped></style>
