<template>
    <div id="teamAddPage">
        <van-form @submit="onSubmit">
            <van-cell-group inset>
                <van-field v-model="addTeamData.name"
                           name="name"
                           label="队伍名"
                           placeholder="请填写队伍名"
                           :rules="[{ required: true, message: '请填写队伍名' }]" />
                <van-field v-model="addTeamData.description"
                           rows="4"
                           autosize
                           label="队伍描述"
                           type="textarea"
                           placeholder="请输入描述" />
                <van-field name="stepper"
                           label="最大人数">
                    <template #input>
                        <van-stepper v-model="addTeamData.maxNum"
                                     min="3"
                                     max="10" />
                    </template>
                </van-field>
                <van-field v-model="result"
                           is-link
                           readonly
                           name="datePicker"
                           label="过期时间"
                           :placeholder="result || '点击选择过期时间'"
                           @click="showPicker = true" />
                <van-popup v-model:show="showPicker"
                           position="bottom">
                    <van-date-picker v-model="addTeamData.expireTime"
                                     title="请选择过期时间"
                                     @confirm="onConfirm"
                                     @cancel="showPicker = false"
                                     :min-date="minDate" />
                </van-popup>
                <van-field name="radio"
                           label="队伍状态">
                    <template #input>
                        <van-radio-group v-model="addTeamData.status"
                                         direction="horizontal">
                            <van-radio name="0">公开</van-radio>
                            <van-radio name="1">私有</van-radio>
                            <van-radio name="2">加密</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-model="addTeamData.password"
                           v-if="Number(addTeamData.status) == 2"
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
import { useRouter } from 'vue-router';
import { getLoginUser } from '../globals/user';
import { UserType } from '../models/user';
import { showSuccessToast, showFailToast } from 'vant';
import myAxios from '../plugins/myAxios';
// 初始化数据
const initFormData = {
    name: '',
    description: '',
    maxNum: 3,
    expireTime: [],
    status: 0,
    password: ''
}
const router = useRouter();
// 页面挂载时获取当前用户
const currentUser = ref<UserType>();
onMounted(async () => {
    currentUser.value = await getLoginUser();
})
const minDate = new Date();
// 与表单绑定的数据
const addTeamData = ref({ ...initFormData });
// 表单提交
const onSubmit = async () => {
    const postData = {
        ...addTeamData.value,
        status: Number(addTeamData.value.status),
        expireTime: new Date(...addTeamData.value.expireTime),
        userId: currentUser.value?.id
    }
    const res = await myAxios.post('/team/add', postData);
    if (res.code == 0) {
        showSuccessToast('创建队伍成功');
        // 跳转回队伍页
        router.push({
            path: '/team',
            replace: true
        })
    } else {
        showFailToast('创建队伍失败')
    }

}
const result = ref('');
const showPicker = ref(false);
// DatePicker弹出层确认
const onConfirm = ({ selectedValues }: { selectedValues: string[] }) => {
    console.log(selectedValues);
    // 时间格式化
    result.value = selectedValues.join('/');
    showPicker.value = false;
};
</script>

<style scoped></style>