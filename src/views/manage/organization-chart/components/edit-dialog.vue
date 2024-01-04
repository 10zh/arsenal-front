<template>
  <!--编辑表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('organization.list.add')"
    @cancel="handleEditOrganizationVisible(false)" @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="parentId" :label="t('organization.form.parentId')">
        <a-tree-select v-model="form.parentId" :placeholder="t('organization.form.parentId')" :blockNode="true"
          :checkable="true" :data="treeData" :fieldNames="{
            key: 'id',
            title: 'companyName',
            children: 'children',
          }" />
      </a-form-item>
      <a-form-item field="companyAddress" :label="t('organization.form.companyAddress')"
        :rules="[{ required: true, message: t('organization.form.companyAddress.placeholder') }]">
        <a-input v-model="form.companyAddress" :placeholder="t('organization.form.companyAddress.placeholder')" />
      </a-form-item>
      <a-form-item field="companyName" :label="t('organization.form.companyName')"
        :rules="[{ required: true, message: t('organization.form.companyName.placeholder') }]">
        <a-input v-model="form.companyName" :placeholder="t('organization.form.companyName.placeholder')" />
      </a-form-item>
      <a-form-item field="sort" :label="t('organization.form.sort')"
        :rules="[{ required: true, message: t('organization.form.sort.placeholder') }]">
        <a-input-number v-model="form.sort" :placeholder="t('organization.form.sort.placeholder')" />
      </a-form-item>
      <a-form-item field="users" :label="t('organization.form.useIds')"
        :rules="[{ required: true, message: t('organization.form.useIds.placeholder') }]">
        <a-select :style="{
          width: '100%'
        }" :placeholder="t('organization.form.useIds.placeholder')" v-model="form.users" multiple>
          <a-option v-for="item in manageList" :value="item.id" :key="item.id">{{ item.userName }}</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--编辑表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, watch, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { getManageUser } from '@/api/manage/user'
import { querySingleCompany, getOrganizationPageList, editCompany } from '@/api/manage/organization-chart'
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
// 表单参数
const form = reactive({
  companyAddress: '',
  companyName: '',
  sort: '',
  users: [],
  parentId: null,
});
// 是否可见
const visible = ref(false);
// 表单引用
const formRef = ref();
// 管理员列表
const manageList = ref([])
// 组织id
const companyId = ref()
// 组织树
const treeData = ref([])
// 调用父组件列表接口，刷新
const emits = defineEmits(['initData'])

// ==========================事件响应模块==========================
// 点击确认事件
const handleBeforeOk = (done) => {
  // 表单参数校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      done(false);
    } else {
      // 添加引擎
      const res = await editCompany(form, companyId.value);
      if (res.success) {
        Message.success(t('global.insert.success'));
        emits('initData')
      }
      done();
    }
  });
};
// 取消事件
const handleEditOrganizationVisible = (flag, id) => {
  visible.value = flag;
  if (id) {
    companyId.value = id;
  }
};
// 查询管理员用户
const getUserByRoleId = async () => {
  const data = await getManageUser()
  manageList.value = data.data;
}
// 表单数据回显
const initForm = async () => {
  const res = await querySingleCompany(companyId.value)
  let newAdmins = [];
  if (res.data.admins.length > 0) {
    newAdmins = res.data.admins.map(item => item.toString())
  }
  console.log(res.data.admins)
  form.companyAddress = res.data.companyAddress;
  form.companyName = res.data.companyName;
  form.sort = res.data.sort;
  form.users = newAdmins;
  form.parentId = res.data.parentId || null;
}
// 初始化上级组织
const initOrganizationList = async () => {
  const res = await getOrganizationPageList();
  treeData.value = res.data;

}

// ==========================父子组件通信模块==========================
defineExpose({
  handleEditOrganizationVisible,
});
// ==========================表单对话框监听模块==========================
watch(visible, (newValue, oldValue) => {
  if (newValue) {
    getUserByRoleId()
    initForm()
    initOrganizationList()

  }
})
</script>

<style scoped lang="less"></style>
