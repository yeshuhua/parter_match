<template>
    <div id="teamEditPage">
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="editTeamData.name"
                           name="name"
                           label="队伍名"
                           placeholder="请填写队伍名"
                           :rules="[{ required: true, message: '请填写队伍名' }]" />
                <van-field v-model="editTeamData.description"
                           rows="4"
                           autosize
                           label="队伍描述"
                           type="textarea"
                           placeholder="请输入描述" />
                <van-field v-model="result"
                           is-link
                           readonly
                           name="datePicker"
                           label="过期时间"
                           :placeholder="result || '点击选择过期时间'"
                           @click="showPicker = true" />
                <van-popup v-model:show="showPicker"
                           position="bottom">
                    <van-date-picker v-model="(editTeamData.expireTime as string[])"
                                     title="请选择过期时间"
                                     @confirm="onConfirm"
                                     @cancel="showPicker = false"
                                     :min-date="minDate" />
                </van-popup>
                <van-field name="radio"
                           label="队伍状态">
                    <template #input>
                        <van-radio-group v-model="editTeamData.status"
                                         direction="horizontal">
                            <van-radio name="0">公开</van-radio>
                            <van-radio name="1">私有</van-radio>
                            <van-radio name="2">加密</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="editTeamData.password"
                           v-if="Number(editTeamData.status) == 2"
                           type="password"
                           name="密码"
                           label="密码"
                           placeholder="请输入密码"
                           :rules="[{ required: true, message: '请填写密码' }]" />

            </van-cell-group>
            <div style="margin: 16px;">
                <van-button round
                            block
                            type="primary"
                            native-type="submit">
                    提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { TeamType } from '../models/team';
import { EditTeamType } from '../models/team';
import myAxios from '../plugins/myAxios';
import { showSuccessToast, showFailToast } from 'vant';
// 初始化数据
const editTeamData = ref<EditTeamType>({});
// 获取路由参数
const route = useRoute();
const router = useRouter();
// 挂载时获取当前队伍信息
onMounted(async () => {
    const res = await myAxios.get('/team/list', {
        params: {
            id: route.query.id
        }
    })
    if (res.code == 0) {
        showSuccessToast('加载成功');
        // console.log(res.data);
        let temp = res.data[0];
        // 转换一些数据的格式以便显示在表单中
        editTeamData.value = {
            ...temp,
            expireTime: temp.expireTime.split('T')[0].split('-'),
            status: String(temp.status)
        };
        result.value = temp.expireTime.split('T')[0].split('-').join('/');
    } else {
        showFailToast('队伍信息加载失败');
    }
})
const minDate = new Date();
// 表单提交
const onSubmit = async () => {
    const postData = {
        ...editTeamData.value,
        status: Number(editTeamData.value.status),
        expireTime: new Date(...editTeamData.value.expireTime),
        password: editTeamData.value.status != 2 ? '' : editTeamData.value.password
    }
    console.log(postData);
    const res = await myAxios.post('/team/update', postData);
    if (res.code == 0) {
        showSuccessToast('队伍更新成功');
        router.push({
            path: '/team',
            replace: true
        })
    } else {
        showFailToast('队伍更新失败');
    }

}
const result = ref('');
const showPicker = ref(false);
// DatePicker弹出层确认
const onConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
    // console.log(selectedValues);
    // 时间格式化
    result.value = selectedValues.join('/');
    showPicker.value = false;
};
</script>

<style scoped></style>
