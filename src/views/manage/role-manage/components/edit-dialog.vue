<template>
  <!--编辑表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('role.edit')" @cancel="handleEditRoleVisible(false)"
    @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="name" :label="t('role.list.name')" :rules="[{ required: true, message: t('role.list.name') }]">
        <a-input v-model="form.name" :placeholder="t('role.list.name')" />
      </a-form-item>
      <a-form-item field="menuIds" :label="t('role.list.menuIds')">
        <a-select v-model="form.menuIds" :placeholder="t('role.list.menuIds')">
          <a-option v-for="item in menuIdsList" :key="item.value" :value="item.value">{{ item.label }}</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="description" :label="t('role.list.description')">
        <a-input v-model="form.description" :placeholder="t('role.list.description')" />
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
  <!--编辑表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, defineEmits, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { editRole, getRole } from '@/api/manage/role'

const { t } = useI18n();
const emits = defineEmits(['initRefresh'])
// 表单参数
const form = reactive({
  menuIds: [],
  description: '',
  sort: null,
  status: null,
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
const menuIdsList = [{
  value: 0,
  label: '其他组织',
},]
// 是否可见
const visible = ref(false);
// 表单引用
const formRef = ref();
// 角色id
const roleId = ref()

// ==========================事件响应模块==========================
// 点击确认事件
const handleBeforeOk = (done) => {
  // 表单参数校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      done(false);
    } else {
      // 添加引擎
      const res = await editRole(roleId.value, form);
      if (res.success) {
        Message.success(t('global.edit.success'));
        emits('initRefresh')
      }
      done();
    }
  });
};
// 取消事件
const handleEditRoleVisible = (flag, id = null) => {
  visible.value = flag;
  if (id) {
    roleId.value = id
  }
};
// 回显角色信息
const initForm = async () => {
  const res = await getRole(roleId.value);
  Object.assign(form, res.data)
}
// ==========================父子组件通信模块==========================
defineExpose({
  handleEditRoleVisible,
});
// 
watch(visible, (newValue, oldValue) => {
  if (newValue) {
    initForm()
  }

})
</script>

<style scoped lang="less"></style>
