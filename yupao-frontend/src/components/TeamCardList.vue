<template>
    <div id="teamCardListPage">
        <van-card v-for="team in props.teamList"
                  :desc="team.description"
                  :title="team.name"
                  :key="team.id"
                  :thumb="kun">
            <template #tags>
                <van-tag plain
                         type="primary"
                         style="margin-right: 8px;margin-top: 8px">
                    {{ teamStatusEnum[team.status] }}
                </van-tag>
            </template>
            <template #bottom>
                <div>
                    {{ '最大人数：' + team.maxNum }}
                </div>
                <div v-if="team.expireTime">
                    {{ '过期时间' + team.expireTime }}
                </div>
                <div>
                    {{ '创建时间' + team.createTime }}
                </div>
            </template>
            <template #footer>
                <van-button v-if="team.userId != currentUser?.id && !hasJoinTeamIds.includes(team.id)"
                            size="small"
                            type="primary"
                            plain
                            @click="preJoinTeam(team)">加入队伍
                </van-button>
                <van-button v-if="team.Users && team.Users[0].id == currentUser?.id"
                            size="small"
                            type="default"
                            plain
                            @click="doUpdateTeam(team.id)">更新队伍
                </van-button>
                <van-button v-if="hasJoinTeamIds.includes(team.id)"
                            size="small"
                            type="default"
                            plain
                            @click="doQuitTeam(team.id)">退出队伍
                </van-button>
                <van-button v-if="team.Users && team.Users[0].id == currentUser?.id"
                            size="small"
                            type="danger"
                            plain
                            @click="doDeleteTeam(team.id)">解散队伍
                </van-button>
            </template>
        </van-card>
        <van-dialog v-model:show="showPwdDialog"
                    title="请输入队伍密码"
                    show-cancel-button
                    @confirm="coonfirmJoin()"
                    @cancel="doClear()">
            <van-field v-model="teamPassword"
                       placeholder="请输入队伍密码" />
        </van-dialog>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { TeamType } from "../models/team";
import { TeamUserType } from "../models/teamUser";
import { teamStatusEnum } from "../constants/team";
import { showSuccessToast, showFailToast, showNotify } from 'vant';
import myAxios from "../plugins/myAxios";
import { getLoginUser } from "../globals/user";
import kun from "../assets/kun.png";

interface teamCardListProps {
    teamList: TeamType[];
}
const router = useRouter();
// defineProps和withDefaults是vue3提供的方法，用来给props更多的类型提示，只能在setup语法糖中使用
const props = withDefaults(defineProps<teamCardListProps>(), {
    // @ts-ignore
    // 提供默认值
    teamList: []
});
const showPwdDialog = ref(false);
const teamPassword = ref('');
// 获取当前用户
const currentUser = ref<{ id?: number }>();
const hasJoinTeamIds = ref<number[]>([]);
const joinTeamId = ref();
onMounted(async () => {
    currentUser.value = await getLoginUser();
    const res = await myAxios.get('/team/my/join');
    if (res.code != 0) {
        showNotify({ type: 'danger', message: '队伍数据加载失败' });
        return;
    }
    // 如果该用户未加入队伍，就不用再根据队伍id数组查询队伍数据了，直接为空
    if (res.data.length == 0) {
        hasJoinTeamIds.value = [];
        return;
    }
    // 队伍id数组作为后端枚举查询条件
    hasJoinTeamIds.value = res.data.map((item: TeamUserType) => item.teamId);
})

const preJoinTeam = (team: TeamType) => {
    joinTeamId.value = team.id;
    // 公开的队伍和私人队伍不用输入密码
    if (team.status == 0 || team.status == 1) {
        doJoinTeam();
    } else {
        // 加密队伍，需要输入密码，显示弹窗
        showPwdDialog.value = true;
    }
}
// 点击加入队伍按钮
const doJoinTeam = async () => {
    if (!joinTeamId.value) return;
    const res = await myAxios.post('/team/join', {
        teamId: joinTeamId.value,
        password: teamPassword.value
    })
    if (res.code == 0) {
        showSuccessToast('加入成功');
        hasJoinTeamIds.value.push(joinTeamId.value);
    } else {
        showFailToast({
            message: '加入失败' + res.message ? `${res.message}` : ''
        })
    }
}
const coonfirmJoin = () => {
    doJoinTeam();
}

// 取消加入队伍，关闭弹窗
const doClear = () => {
    joinTeamId.value = 0
    teamPassword.value = '';
    showPwdDialog.value = false;
}
// 修改队伍信息
const doUpdateTeam = (teamId: number) => {
    router.push({
        path: '/team/edit',
        query: {
            id: teamId
        }
    })
}

// 退出队伍
const doQuitTeam = async (teamId: number) => {
    const res = await myAxios.post('/team/quit', {
        teamId
    })
    if (res.code != 0) {
        showFailToast({
            message: '退出失败' + res.message ? `${res.message}` : ''
        })
        return;
    }
    hasJoinTeamIds.value.splice(hasJoinTeamIds.value.findIndex(id => id == teamId), 1);
    showSuccessToast('退出成功');
    router.push({
        path: '/team',
        replace: true
    })
}

// 解散队伍
const doDeleteTeam = async (teamId: number) => {
    const res = await myAxios.post('/team/delete', {
        teamId
    })
    if (res.code != 0) {
        showFailToast({
            message: '解散队伍失败' + res.message ? `${res.message}` : ''
        })
        return;
    }
    hasJoinTeamIds.value.splice(hasJoinTeamIds.value.findIndex(id => id == teamId), 1);
    showSuccessToast('解散队伍成功');
    router.push({
        path: '/team',
        replace: true
    })
}
</script>
  
<style scoped>
#teamCardListPage :deep(.van-card__thumb) {
    height: unset;
}
</style>
  