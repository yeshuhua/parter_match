<template>
  <van-card v-for="user in props.userList" :desc="user.profile" :title="`${user.username}(${user.planetCode})`"
    :thumb="user.avatarUrl">
    <template #tags>
      <van-tag plain type="primary" v-for="tag in user.tags" style="margin-right: 8px;margin-top: 8px">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini">联系我</van-button>
    </template>
  </van-card>
</template>

<script setup lang="ts">
import { UserType } from "../models/user";

interface userCardListProps {
  userList: UserType[];
}
// defineProps和withDefaults是vue3提供的方法，用来给props更多的类型提示，只能在setup语法糖中使用
const props = withDefaults(defineProps<userCardListProps>(), {
  // @ts-ignore
  // 提供默认值
  userList: []
});
</script>

<style scoped></style>
