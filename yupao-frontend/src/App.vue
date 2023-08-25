<script setup lang="ts">
import BasicLayout from "./layouts/BasicLayout.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import routes from "./config/routes";
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);
const router = useRouter();
// 根据路由切换标题
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find(route => toPath == route.path);
  title.value = route?.title ?? DEFAULT_TITLE;
})
</script>

<template>
  <BasicLayout :title="title"></BasicLayout>
</template>

<style scoped></style>
