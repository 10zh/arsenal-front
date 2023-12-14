<template>
  <div ref="header">
    <!--数据搜索模块 start-->
    <a-row>
      <a-col :flex="1">
        <a-form :model="form" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="companyName" :label="t('organization.form.companyName')">
                <a-input v-model="pagination.companyName"
                  :placeholder="t('organization.form.companyName.placeholder')"></a-input>
              </a-form-item>
            </a-col>
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
                <a-button type="primary" @click="addRole">
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
      <!-- 查询&重置按钮start -->
    </a-row>
    <!-- 新增按钮end -->
  </div>
  <a-table row-key="id" :columns="columns" :style="{ height: tableHeight + 'px' }" :data="organizationList" :expandable="expandable">
  </a-table>
  <!-- 添加组织架构对话框 -->
  <addDialog ref="addOrganizationRef"></addDialog>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import formatDate from '@/utils/times';
import { getOrganizationPageList } from '@/api/manage/organization-chart'
import addDialog from './add-dialog.vue'

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
}, {
  title: t('organization.form.userNum'),
  dataIndex: 'userNum',
}, {
  title: t('organization.form.createBy'),
  dataIndex: 'createBy',
}]
// ==========================事件响应模块==========================
// 初始化列表数据
const initOrganizationList = () => {
  organizationList.value = [{
    companyName: '测试', companyAddress: '1111', userInfoVOList: [{
      nickname: '小明'
    }]
  }]
  // const res = await getOrganizationPageList(pagination);
  // organizationList.value = res.data;
}
// 新增角色
const addRole = () => {
  addOrganizationRef.value.handleAddOrganizationVisible(true);
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