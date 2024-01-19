<template>
  <!--添加引擎表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('manage.user.edit.dialog')" @cancel="handleEditVisible(false)"
    @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="companyIds" :label="t('manage.user.companyId')">
        <a-tree-select v-model="form.companyIds" placeholder="t('manage.user.companyId')" :blockNode="true"
          :checkable="true" :data="organizationList" :tree-checkable="true" multiple :fieldNames="{
            key: 'id',
            title: 'companyName',
            children: 'children',
          }" />
      </a-form-item>
      <a-form-item field="roleId" :label="t('manage.user.roleId')"
        :rules="[{ required: true, message: t('manage.user.roleId') }]">
        <a-select v-model="form.roleId" :placeholder="t('manage.user.roleId')">
          <a-option v-for="item in roleList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="username" :label="t('manage.user.username')"
        :rules="[{ required: true, message: t('manage.user.username') }]">
        <a-input v-model="form.username" :placeholder="t('manage.user.username')" />
      </a-form-item>
      <a-form-item field="nickName" :label="t('manage.user.nickName')">
        <a-input v-model="form.nickName" :placeholder="t('manage.user.nickName')" />
      </a-form-item>
      <a-form-item field="email" :label="t('manage.user.email')">
        <a-input v-model="form.email" :placeholder="t('manage.user.email')" />
      </a-form-item>

      <!-- <a-form-item field="password" :label="t('manage.user.password')"
        :rules="[{ required: true, message: t('manage.user.password') }]">
        <a-input v-model="form.password" :placeholder="t('manage.user.password')" />
      </a-form-item> -->
      <a-form-item field="phone" :label="t('manage.user.phone')">
        <a-input v-model="form.phone" :placeholder="t('manage.user.phone')" />
      </a-form-item>

      <a-form-item field="status" :label="t('manage.user.status')"
        :rules="[{ required: true, message: t('manage.user.status') }]">
        <a-radio-group v-model="form.status" :options="statusOptions" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--添加引擎表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getSingleUser, addUser, updateSingleUser } from '@/api/manage/user';
import { getOrganizationPageList } from '@/api/manage/organization-chart'
import { getUseRole } from '@/api/manage/role'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
// 表单参数
const form = reactive({
  companyIds: [],
  email: '',
  nickName: '',
  phone: '',
  roleId: null,
  username: '',
  status: 0,
});
// 组织架构列表分页参数
const page = reactive({
  pageIndex: 1,
  pageSize: 10
})
// 用户状态
const statusOptions = [{
  label: '禁用',
  value: 1
}, {
  label: '启用',
  value: 0
}]
// 是否可见
const visible = ref(false);
// 表单引用
const formRef = ref();
// 角色列表
const roleList = ref([])
// 用户id
const userId = ref();
// 组织架构列表
const organizationList = ref([])
// ==========================事件响应模块==========================
// 点击确认事件
const handleBeforeOk = (done) => {
  console.log()
  // 表单参数校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      done(false);
    } else {
      // 添加引擎
      const res = await updateSingleUser(userId.value, form);
      if (res.success) {
        Message.success(t('global.edit.success'));
      }
      done();
    }
  });
};
// 取消事件
const handleEditVisible = (flag, id) => {
  visible.value = flag;
  if (id) {
    userId.value = id;
  }
  formRef.value.resetFields()
};
// 查询角色列表
const queryAllRolesList = async () => {
  const res = await getUseRole();
  roleList.value = res.data;


}
// 查询组织架构列表
const queryAllCompanyIdList = async () => {
  const res = await getOrganizationPageList();
  organizationList.value = res.data;
}
// 回显用户信息
const initUserInfo = async () => {
  const res = await getSingleUser(userId.value)
  Object.assign(form, res.data);

  console.log(form)

}
// ==========================父子组件通信模块==========================
defineExpose({
  handleEditVisible,
});
// ==========================对话框监听模块==========================
watch(visible, async (newValue, oldValue) => {
  if (newValue) {
    // 回显用户信息
    initUserInfo()
    // 获取组织架构
    await queryAllCompanyIdList()
    await queryAllRolesList()
  }

})
</script>

<style scoped lang="less"></style>
