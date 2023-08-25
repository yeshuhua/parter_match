<template>
    <div id="UserTeamJoinPage">
        <van-search v-model="searchText"
                    placeholder="搜索队伍"
                    @search="onSearch"
                    @clear="onCancel" />
        <user-team-list :team-list="teamList"></user-team-list>
        <van-empty v-if="!teamList || teamList.length == 0"
                   image="search"
                   description="搜索结果为空" />
    </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import TeamCardList from "../components/TeamCardList.vue";
import myAxios from '../plugins/myAxios';
import { showFailToast, showSuccessToast } from 'vant';
import { getLoginUser } from '../globals/user';
export default defineComponent({
    components: {
        'user-team-list': TeamCardList
    },
    setup() {
        const currentUser = ref({});
        const teamList = ref([]);
        const searchText = ref('');
        onMounted(async () => {
            // 当前用户
            currentUser.value = await getLoginUser();
            const res = await myAxios.get('/team/my/create');
            if (res.code != 0) {
                showFailToast('数据加载失败');
                return;
            }
            showSuccessToast('数据加载成功');
            teamList.value = res.data;
        })
        const onSearch = async (val = '') => {
            const res = await myAxios.get('/team/list', {
                params: {
                    searchText: val,
                    // 在本用户创建的队伍基础上筛选
                    userId: currentUser.value.id
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
        return {
            teamList,
            searchText,
            onSearch,
            onCancel
        }
    }
})
</script>

<style scoped></style>