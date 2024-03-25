<template>
  <!-- 导航条 -->
  <van-nav-bar :title="title"
               class="fixedTop"
               left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight">
    <template #right>
      <van-icon name="search"
                size="18" />
    </template>
  </van-nav-bar>
  <div id="content">
    <router-view></router-view>
  </div>
  <!-- tabbar -->
  <van-tabbar route>
    <van-tabbar-item to="/"
                     icon="home-o"
                     name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team"
                     icon="search"
                     name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user"
                     icon="friends-o"
                     name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Index from "../pages/Index.vue";
import Team from "../pages/Team.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  props: {
    title: String
  },
  components: { Index, Team },
  setup() {
    const router = useRouter();
    const onClickLeft = () => {
      router.back();
    };
    const onClickRight = () => {
      // 跳转到搜索页面
      router.push("/search");
    };
    return {
      onClickLeft,
      onClickRight
    };
  }
});
</script>

<style scoped>
#content {
  padding-bottom: 40px;
  padding-top: 46px;
}

.fixedTop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}
</style>
