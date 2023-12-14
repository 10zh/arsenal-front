<template>
  <!--添加引擎表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('manage.user.add')" @cancel="handleAddRoleVisible(false)"
    @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="companyId" :label="t('manage.user.companyId')"
        :rules="[{ required: true, message: t('manage.user.companyId') }]">
        <a-input v-model="form.companyId" :placeholder="t('manage.user.companyId')" />
      </a-form-item>
      <a-form-item field="username" :label="t('manage.user.username')"
        :rules="[{ required: true, message: t('manage.user.username') }]">
        <a-input v-model="form.username" :placeholder="t('manage.user.username')" />
      </a-form-item>
      <a-form-item field="email" :label="t('manage.user.email')">
        <a-input v-model="form.email" :placeholder="t('manage.user.email')" />
      </a-form-item>
      <a-form-item field="nickName" :label="t('manage.user.nickName')">
        <a-input v-model="form.nickName" :placeholder="t('manage.user.nickName')" />
      </a-form-item>
      <a-form-item field="password" :label="t('manage.user.password')"
        :rules="[{ required: true, message: t('manage.user.password') }]">
        <a-input v-model="form.password" :placeholder="t('manage.user.password')" />
      </a-form-item>
      <a-form-item field="phone" :label="t('manage.user.phone')">
        <a-input v-model="form.phone" :placeholder="t('manage.user.phone')" />
      </a-form-item>
      <a-form-item field="roleId" :label="t('manage.user.roleId')"
        :rules="[{ required: true, message: t('manage.user.roleId') }]">
        <a-input v-model="form.password" :placeholder="t('manage.user.roleId')" />
      </a-form-item>
      <a-form-item field="status" :label="t('manage.user.status')"
        :rules="[{ required: true, message: t('manage.user.status') }]">
        <a-input v-model="form.status" :placeholder="t('manage.user.status')" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--添加引擎表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { addScanEngine } from '@/api/scan/scan-engine';
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
// 表单参数
const form = reactive({
  companyId: '',
  email: '',
  nickName: '',
  password: '',
  phone: '',
  roleId: '',
  status: '',
  username: '',
});
// 是否可见
const visible = ref(false);
// 表单引用
const formRef = ref();

// ==========================事件响应模块==========================
// 点击确认事件
const handleBeforeOk = (done) => {
  // 表单参数校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      done(false);
    } else {
      // 添加引擎
      const res = await addScanEngine(form);
      if (res.success) {
        Message.success(t('global.insert.success'));
      }
      done();
    }
  });
};
// 取消事件
const handleAddRoleVisible = (flag) => {
  visible.value = flag;
};

// ==========================父子组件通信模块==========================
defineExpose({
  handleAddRoleVisible,
});
</script>

<style scoped lang="less"></style>
