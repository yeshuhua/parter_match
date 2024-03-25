<template>
    <div id="UserTeamJoinPage">
        <van-search v-model="searchText"
                    class="search"
                    placeholder="搜索队伍"
                    @search="onSearch"
                    @clear="onCancel" />
        <div class="content">
            <user-team-list :team-list="teamList"></user-team-list>
            <van-empty v-if="!teamList || teamList.length == 0"
                       image="search"
                       description="搜索结果为空" />
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import TeamCardList from "../components/TeamCardList.vue";
import myAxios from '../plugins/myAxios';
import { showFailToast, showSuccessToast, showNotify } from 'vant';
import { TeamUserType } from '../models/teamUser';
export default defineComponent({
    components: {
        'user-team-list': TeamCardList
    },
    setup() {
        const idsArr = ref([]);
        const teamList = ref([]);
        const searchText = ref('');
        onMounted(async () => {
            const res = await myAxios.get('/team/my/join');
            if (res.code != 0) {
                showNotify({ type: 'danger', message: '队伍数据加载失败' });
                return;
            }
            // 如果该用户未加入队伍，就不用再根据队伍id数组查询队伍数据了，直接为空
            if (res.data.length == 0) {
                teamList.value = [];
                return;
            }
            // 队伍id数组作为后端枚举查询条件
            idsArr.value = res.data.map((item: TeamUserType) => item.teamId);
            const res2 = await myAxios.get('/team/list', {
                params: {
                    ids: JSON.stringify(idsArr.value)
                }
            })
            if (res2.code != 0) {
                showNotify({ type: 'danger', message: '队伍数据加载失败' });
                return;
            }
            // console.log(res2.data);
            showNotify({ type: 'success', message: '加载成功' });
            teamList.value = res2.data;
        })
        const onSearch = async (val = '') => {
            const res = await myAxios.get('/team/list', {
                params: {
                    searchText: val,
                    // 保证是在本用户所在队伍的基础上筛选
                    ids: JSON.stringify(idsArr.value)
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
            onCancel,
            onSearch
        }
    }
})

</script>

<style scoped>
.search {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 1;
}

.content {
    padding-top: 46px;
}
</style>