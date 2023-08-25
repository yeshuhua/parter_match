<template>
  <div id="teamPage">
    <van-search v-model="searchText"
                placeholder="搜索队伍"
                @search="onSearch"
                @cancel="onCancel" />
    <van-tabs v-model:active="activeName"
              @change="onTabChange">
      <van-tab title="公开"
               :name="0"></van-tab>
      <van-tab title="加密"
               :name="2"></van-tab>
    </van-tabs>
    <user-team-list :team-list="teamList"
                    v-if="teamList.length != 0"></user-team-list>
    <van-empty v-if="!teamList || teamList.length == 0"
               image="search"
               description="搜索结果为空" />
    <van-button type="primary"
                icon="plus"
                class="add_btn"
                @click="toAddTeam"></van-button>

  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import myAxios from "../plugins/myAxios";
import TeamCardList from "../components/TeamCardList.vue";
import { showNotify, showSuccessToast, showFailToast } from 'vant';
import { getLoginUser } from "../globals/user";

export default defineComponent({
  components: {
    'user-team-list': TeamCardList
  },
  setup() {

    const activeName = ref();
    const teamList = ref([]);
    const searchText = ref('');
    const router = useRouter();
    const route = useRoute();
    onMounted(async () => {
      const result = await getLoginUser();
      // console.log(result);

      if (!result) {
        router.push({
          path: '/user/login',
          query: {
            redirect: route.path
          },
          replace: true
        })
        return;
      }
      searchList();

    })
    const searchList = async (status = -1) => {
      const res = await myAxios.get('/team/list',
        {
          params: {
            status
          }
        }
      )
      // console.log(res.code);

      if (res.code == 0) {
        showNotify({ type: 'success', message: '加载成功' });
        teamList.value = res.data;
      } else {
        showNotify({ type: 'danger', message: '队伍数据加载失败' });
      }
    }
    // 创建队伍按钮点击
    const toAddTeam = () => {
      router.push({
        path: '/team/add'
      })
    }
    // 和onMounted内的代码大同小异，可以提取
    const onSearch = async (val = '') => {
      const res = await myAxios.get('/team/list', {
        params: {
          searchText: val
        }
      })
      if (res.code == 0) {
        showSuccessToast('已完成过滤');
        teamList.value = res.data;
      } else {
        showFailToast({
          message: '搜索失败',
          duration: 1500
        })
      }
    }
    // 搜索框取消
    const onCancel = () => {
      searchText.value = '';
    }
    const onTabChange = (name) => {
      if (name == 0) {
        searchList(0);
      } else if (name == 2) {
        searchList(2);
      }
    }
    return {
      toAddTeam,
      teamList,
      searchText,
      onSearch,
      onCancel,
      activeName,
      onTabChange
    }
  }
});
</script>


<style scoped></style>
