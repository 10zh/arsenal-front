<template>
  <!--添加引擎表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('manage.user.add')" @cancel="handleAddRoleVisible(false)"
    @before-ok="handleBeforeOk">
    <a-alert style="margin:0px 0 20px 0">{{ t('password.message') }}</a-alert>
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="companyIds" :label="t('manage.user.companyId')"
        :rules="[{ required: true, message: t('manage.user.companyId') }]">
        <a-tree-select v-model="form.companyIds" @focus="initOrganizationList" :placeholder="t('manage.user.companyId')"
          :blockNode="true" :tree-checkable="true" :checkable="true" :data="organizationList" :fieldNames="{
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
      <a-form-item field="nickName" :label="t('manage.user.nickName')"
        :rules="[{ required: true, message: t('manage.user.nickName') }]">
        <a-input v-model="form.nickName" :placeholder="t('manage.user.nickName')" />
      </a-form-item>
      <a-form-item field="email" :rules="[{ required: true, message: t('manage.user.email') }]"
        :label="t('manage.user.email')">
        <a-input v-model="form.email" :placeholder="t('manage.user.email')" />
      </a-form-item>

      <!-- <a-form-item field="password" :label="t('manage.user.password')"
        :rules="[{ required: true, message: t('manage.user.password') }]">
        <a-input v-model="form.password" :placeholder="t('manage.user.password')" />
      </a-form-item> -->
      <a-form-item field="phone" :label="t('manage.user.phone')"
        :rules="[{ required: true, message: t('manage.user.phone') }]">
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
import { ref, reactive, watch, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { addUser } from '@/api/manage/user';
import { getUseRole } from '@/api/manage/role'
import { getOrganizationPageList } from '@/api/manage/organization-chart'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
// 表单参数
const form = reactive({
  companyIds: [],
  email: '2765443121@qq.com',
  nickName: '',
  phone: '19972345161',
  roleId: null,
  username: '',
  status: 0,
});
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
// 组织架构列表
const organizationList = ref([])
// 添加成功后调用父组件的获取列表
const emits = defineEmits(['initData'])
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
      const res = await addUser(form);
      if (res.success) {
        Message.success(t('global.insert.success'));
        emits('initData')
      }
      done();
    }
  });
};
// 取消事件
const handleAddRoleVisible = (flag) => {
  visible.value = flag;
};
// 查询未禁用的角色列表
const queryAllRolesList = async () => {
  const res = await getUseRole();
  roleList.value = res.data;
}
// 查询组织架构列表
const queryAllCompanyIdList = async () => {
  const res = await getOrganizationPageList();
  organizationList.value = res.data;
}
// ==========================父子组件通信模块==========================
defineExpose({
  handleAddRoleVisible,
});
// ==========================对话框监听模块==========================
watch(visible, (newValue, oldValue) => {
  if (newValue) {
    queryAllCompanyIdList();
    queryAllRolesList()
    formRef.value.resetFields()
  }

})
</script>

<style scoped lang="less"></style>
