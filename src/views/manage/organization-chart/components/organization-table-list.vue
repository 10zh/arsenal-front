<template>
  <div ref="header">
    <!--数据搜索模块 start-->
    <a-row>
      <a-col :flex="1">
        <a-form :model="form" label-align="left" auto-label-width>
          <!-- 搜索条件start -->
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="companyName" :label="t('organization.form.companyName')">
                <a-input v-model="pagination.companyName"
                  :placeholder="t('organization.form.companyName.placeholder')"></a-input>
              </a-form-item>
            </a-col>
            <!-- 查询&新增&重置按钮start -->
            <a-col :span="8">
              <a-space :size="18">
                <a-button type="primary" style="margin: 0 10px" @click="initEngineList">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('global.search') }}
                </a-button>
                <a-button style="margin: 0 10px" @click="reset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('global.reset') }}
                </a-button>
                <!-- 新增按钮end -->
                <a-button type="primary" @click="addCompany">
                  <template #icon>
                    <icon-plus />
                  </template>
                  {{ $t('organization.list.add') }}
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
      </a-col>

    </a-row>

  </div>
  <!-- 表格start -->
  <a-table row-key="id" :columns="columns" :style="{ height: tableHeight + 'px' }" :data="organizationList"
    :pagination="false">
    <template #admins="{ record }">
      <a-tag v-for="item in record.admins" :key="item.userId" style="margin:5px">{{ item.username }} </a-tag>

    </template>
    <template #creatTime="{ record }">
      <span>{{ formatDate(record.creatTime, 'YYYY-MM-DD hh:mm:ss') }}</span>

    </template>
    <template #operations="{ record }">
      <a-button type="text" size="small" style="padding: 0 5px" @click="handleEdit(record.id)">

        {{ $t('manage.organization.operator.edit') }}
      </a-button>
      <a-popconfirm :content="t('organization.operator.delete.question')" @ok="handleDelete(record)">
        <a-button type="text" status="danger" size="small">

          {{ $t('manage.organization.operator.delete') }}
        </a-button>
      </a-popconfirm>

    </template>
  </a-table>
  <!-- 添加组织架构对话框 -->
  <addDialog ref="addOrganizationRef" @init-data="initOrganizationList"></addDialog>
  <!-- 编辑组织架构对话框 -->
  <editDialog ref="editOrganizationRef" @init-data="initOrganizationList"></editDialog>
</template>
<script setup lang="ts">
// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import formatDate from '@/utils/times';
import { getOrganizationPageList, deleteCompany } from '@/api/manage/organization-chart'
import addDialog from './add-dialog.vue'
import editDialog from './edit-dialog.vue'

const { t } = useI18n();
// 用户列表
const organizationList = ref([

])
// 表格高度
const tableHeight = ref()
// 搜索区域实例
const header = ref()
// 新增组件实例
const addOrganizationRef = ref()
// 编辑组件实例
const editOrganizationRef = ref()
// 分页参数
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
})
// ==========================数据定义模块==========================
// 角色列表表头
const columns = [{
  title: t('organization.form.companyName'),
  dataIndex: 'companyName',
}, {
  title: t('organization.form.companyAddress'),
  dataIndex: 'companyAddress',
},
{
  title: t('organization.form.admins'),
  dataIndex: 'admins',
  slotName: 'admins',

}, {
  title: t('organization.form.createBy'),
  dataIndex: 'createBy',
},
{
  title: t('organization.form.creatTime'),
  dataIndex: 'creatTime',
  slotName: 'creatTime'

},

{
  title: t('role.list.operations'),
  dataIndex: 'operations',
  slotName: 'operations',
},]
// ==========================事件响应模块==========================
// 递归删除children为空
const delChildren = (initList) => {
  initList.forEach(item => {
    if (item.children.length === 0) {
      delete item.children
    } else if (item.children.length > 0) {
      delChildren(item.children);
    }
  })
  return initList
}
// 初始化列表数据
const initOrganizationList = async () => {
  const res = await getOrganizationPageList();

  organizationList.value = delChildren(res.data);

}

// 新增组织架构
const addCompany = () => {
  addOrganizationRef.value.handleAddOrganizationVisible(true);
}
// 删除
const handleDelete = async (record) => {
  const res = await deleteCompany(record.id);
  if (res.success) {
    Message.success(t('company.response.delete'));
    initOrganizationList()
  } else {
    Message.error(res.errMessage);
  }

}
// 编辑
const handleEdit = (id) => {
  editOrganizationRef.value.handleEditOrganizationVisible(true, id)
}
onMounted(() => {
  // 动态计算表格的高度并进行分页
  const height =
    document.documentElement.clientHeight - header.value.offsetHeight - 250;
  tableHeight.value = height;
  pagination.pageSize = Math.floor(height / 50);
  initOrganizationList()

})
</script>
<style scoped lang="less"></style>