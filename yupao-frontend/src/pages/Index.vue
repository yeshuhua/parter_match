<template>
  <user-card-list :user-list="userList"></user-card-list>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import UserCardList from "../components/UserCardList.vue";
import myAxios from "../plugins/myAxios";

export default defineComponent({
  components: {
    'user-card-list': UserCardList
  },
  setup() {
    const userList = ref([])

    onMounted(async () => {
      const res = await myAxios.get('/user/recommend', {
        params: {
          pageSize: 8,
          pageNum: 1
        }
      })
      if (res.code == 0) {
        userList.value = res.data
      }
    })
    return {
      userList
    }
  }
});
</script>


<style scoped></style>
