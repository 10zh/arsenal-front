<template>
  <!--添加表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('organization.list.add')"
    @cancel="handleAddOrganizationVisible(false)" @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="parentId" :label="t('organization.form.parentId')">
        <a-tree-select v-model="form.parentId" @focus="initOrganizationList"
          :placeholder="t('organization.form.parentId')" :data="treeData" :fieldNames="{
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
        }" :placeholder="t('organization.form.useIds.placeholder')" v-model="form.users" multiple
          @search="handleSearch" @dropdown-reach-bottom="loadMore">
          <a-option v-for="item in manageList" :value="item.id" :key="item.id">{{ item.username }}</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--添加表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, watch, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import { addCompany } from '@/api/manage/organization-chart'
import { Message } from '@arco-design/web-vue';
import { getOrganizationPageList } from '@/api/manage/organization-chart'
import { getUserPageList } from '@/api/manage/user'

const { t } = useI18n();
// 表单参数
const form = reactive({
  companyAddress: '',
  companyName: '',
  sort: '',
  users: [],
  parentId: null,
});
// 组织树
const treeData = ref([])
// 是否可见
const visible = ref(false);
// 表单引用
const formRef = ref();
// 管理员列表
const manageList = ref([])
// 管理员列表需要分页
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
  keyword: '',
})
// 调用父组件列表接口，刷新
const emits = defineEmits(['initData'])
// 远程搜索的防抖函数
const timers = ref()
// ==========================事件响应模块==========================
// 点击确认事件
const handleBeforeOk = (done) => {
  // 表单参数校验
  formRef.value.validate(async (valid) => {
    if (valid) {
      done(false);
    } else {
      // 添加引擎
      const res = await addCompany(form);
      if (res.success) {
        Message.success(t('global.insert.success'));
        emits('initData')
      }
      done();
    }
  });
};
// 取消事件
const handleAddOrganizationVisible = (flag) => {
  visible.value = flag;
};
// 查询管理员用户
const getUserByRoleId = async (flag = null) => {
  if (flag) {
    pagination.value.pageIndex = 1;
    manageList.value = [];
  }
  const data = await getUserPageList(pagination.value)
  manageList.value = manageList.value.concat(data.data);
  pagination.value.total = data.totalCount;
};
// 加载更多
const loadMore = () => {
  if (pagination.value.total > manageList.value.length) {
    pagination.value.pageIndex += 1;
    getUserByRoleId()
  }
}
// 远程搜索用户
const handleSearch = (val) => {
  clearTimeout(timers.value)
  timers.value = setTimeout(() => {
    pagination.value.keyword = val;
    getUserByRoleId('init')
  }, 500)
}
// 初始化上级组织
const initOrganizationList = async () => {
  const res = await getOrganizationPageList();
  treeData.value = res.data;

}

// ==========================父子组件通信模块==========================
defineExpose({
  handleAddOrganizationVisible,
});
// ==========================监听模块==========================
watch(visible, (newValue, oldValue) => {
  if (newValue) {
    getUserByRoleId('init')
    formRef.value.resetFields()

  }
})
</script>

<style scoped lang="less"></style>
