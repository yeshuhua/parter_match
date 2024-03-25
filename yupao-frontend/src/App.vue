<script setup lang="ts">
import BasicLayout from "./layouts/BasicLayout.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import routes from "./config/routes";
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);
const router = useRouter();
// 根据路由切换标题
router.beforeEach((to) => {
  const toPath = to.path;
  const route = routes.find(route => toPath == route.path);
  title.value = route?.title ?? DEFAULT_TITLE;
})

// 图片错误处理，未能解决。可以使用nginx解决
// window.addEventListener('error', function (e) {
//   let target = e.target,
//     tagName = (<HTMLElement>target)!.tagName,
//     times = Number((<HTMLElement>target).dataset.times) || 0,
//     allTimes = 3;
//   if (tagName.toUpperCase() === 'IMG') {
//     if (times >= allTimes) {
//       console.log('1');

//     } else {
//       // @ts-ignore
//       target.dataset.times = times;
//       console.log('2');
//       // 需要在vite.config.ts中开启静态资源服务
//       target!.src = '../public/default.jpg'
//     }
//   }
// }, true)
</script>

<template>
  <BasicLayout :title="title"></BasicLayout>
</template>

<style scoped></style>
