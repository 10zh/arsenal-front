<template>
  <!--添加表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('role.add')" @cancel="handleAddRoleVisible(false)"
    @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="companyId" :label="t('role.list.companyId')">
        <a-select v-model="form.companyId" :placeholder="t('role.list.companyId')">
          <a-option v-for="item in companyIdList" :key="item.value" :value="item.value">{{ item.label }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="name" :label="t('role.list.roleName')"
        :rules="[{ required: true, message: t('role.list.roleName') }]">
        <a-input v-model="form.name" :placeholder="t('role.list.roleName')" />
      </a-form-item>
      <a-form-item field="type" :rules="[{ required: true, message: t('role.list.roleType') }]"
        :label="t('role.list.roleType')">
        <a-select v-model="form.type" :placeholder="t('role.list.roleType')">
          <a-option value="default">{{ t('role.select.type.default') }}</a-option>
          <a-option value="custom">{{ t('role.select.type.custom') }}</a-option>
        </a-select>

      </a-form-item>
      <a-form-item field="roleDescription" :label="t('role.list.roleDescription')">
        <a-input v-model="form.description" :placeholder="t('role.list.roleDescription')" />
      </a-form-item>
      <a-form-item field="sort" :label="t('role.list.sort')" :rules="[{ required: true, message: t('role.list.sort') }]">
        <a-input-number v-model="form.sort" :placeholder="t('role.list.sort')" class="input-demo" :min="0" :max="100" />
      </a-form-item>
      <a-form-item field="status" :label="t('role.list.status')"
        :rules="[{ required: true, message: t('role.list.status') }]">
        <a-radio-group v-model="form.status" :options="statusOptions" />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--添加表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { addRole } from '@/api/manage/role'

const { t } = useI18n();
const emits = defineEmits(['initRefresh'])
// 表单参数
const form = reactive({
  companyId: null,
  menuIds: [],
  description: '',
  sort: 4,
  status: 0,
  name: '',
  type: '',

});
// 角色状态
const statusOptions = [{
  label: '禁用',
  value: 1
}, {
  label: '启用',
  value: 0
}]
// 所属组织架构select数据
const companyIdList = []
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
      const res = await addRole(form);
      if (res.success) {
        Message.success(t('global.insert.success'));
        emits('initRefresh')
      }
      done();
    }
  });
};
// 取消事件
const handleAddRoleVisible = (flag) => {
  visible.value = flag;
  formRef.value.resetFields()
};

// ==========================父子组件通信模块==========================
defineExpose({
  handleAddRoleVisible,
});
</script>

<style scoped lang="less"></style>
