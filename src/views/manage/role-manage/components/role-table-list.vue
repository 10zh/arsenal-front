<template>
  <div ref="header">
    <!--数据搜索模块 start-->
    <a-row>
      <a-col :flex="1">
        <a-form :model="form" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="engineName" :label="t('scan.engine.name')">
                <a-input v-model="pagination.engineName" :placeholder="t('scan.engine.name.input')"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="address" :label="t('scan.engine.address')">
                <a-input v-model="pagination.address" :placeholder="t('scan.engine.address.input')"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="port" :label="t('scan.engine.port')">
                <a-input v-model="pagination.port" :placeholder="t('scan.engine.port.input')"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="status" :label="t('scan.engine.status')">
                <a-select v-model="pagination.status" :placeholder="t('scan.engine.status.input')" allow-clear
                  :options="statusOptions">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="createTime" :label="t('scan.engine.createTime')">
                <a-range-picker v-model="pagination.createTime" :style="{ width: '100%' }" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="version" :label="t('scan.engine.version')">
                <a-input v-model="pagination.engineVersion" :placeholder="t('scan.engine.version.input')"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <!-- 查询&重置按钮start -->
      <a-divider style="height: 84px" direction="vertical"></a-divider>
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="vertical" :size="18">
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
        </a-space>
      </a-col>
      <!-- 查询&重置按钮start -->
    </a-row>
    <a-divider style="margin-top: 0"></a-divider>
    <!--数据搜索模块 end-->
    <!-- 新增按钮start -->
    <a-row style="margin-bottom: 16px">
      <a-col :span="24" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <a-space>
          <a-button type="primary" @click="addRole">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('role.list.add') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <!-- 新增按钮end -->
  </div>
  <a-table row-key="id" :columns="columns" :pagination="false" :style="{ height: tableHeight + 'px' }" :data="roleList">
    <template #createTime="{ record }">
      <span>{{ formatDate(record.creatTime, 'YYYY-MM-DD hh:mm:ss') }}</span>

    </template>
    <template #operations="{ record }">
      <a-button type="text" size="small" style="padding: 0 5px" @click="handleEdit(record)">

        {{ $t('manage.role.operator.edit') }}
      </a-button>
      <a-popconfirm :content="t('manage.role.operator.delete.question')" @ok="handleDelete(record)">
        <a-button type="text" status="danger" size="small">

          {{ $t('manage.role.operator.delete') }}
        </a-button>
      </a-popconfirm>
      <a-button type="text" size="small" status="success" style="padding: 0 5px" @click="handleEdit(record)">
        {{ $t('manage.role.operator.menu') }}
      </a-button>
      <a-button type="text" size="small" status="warning" style="padding: 0 5px" @click="handleEdit(record)">

        {{ $t('manage.role.operator.user') }}
      </a-button>
    </template>
  </a-table>
  <a-pagination class="paginationStyle" :total="pagination.total" :current="pagination.current"
    :page-size="pagination.pageSize" show-total @change="changePageIndex" />
  <!-- 添加角色对话框 -->
  <addDialog ref="addRoleRef" @init-refresh="initRoleList"></addDialog>
  <!-- 编辑角色对话框 -->
  <editDialog ref="editRoleRef" @init-refresh="initRoleList"></editDialog>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import formatDate from '@/utils/times';
import { getRolePageList, deleteRole } from '@/api/manage/role'
import addDialog from './add-dialog.vue'
import editDialog from './edit-dialog.vue'

const { t } = useI18n();
// 用户列表
const roleList = ref([])
// 表格高度
const tableHeight = ref()
// 搜索区域实例
const header = ref()
// 新增组件实例
const addRoleRef = ref()
// 编辑组件实例
const editRoleRef = ref()
// 分页参数
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 10,
})
// ==========================数据定义模块==========================
// 角色列表表头
const columns = [{
  title: t('role.list.roleName'),
  dataIndex: 'roleName',
}, {
  title: t('role.list.roleType'),
  dataIndex: 'roleType',
}, {
  title: t('role.list.userNum'),
  dataIndex: 'userNum',
}, {
  title: t('role.list.roleDescription'),
  dataIndex: 'roleDescription',
}, {
  title: t('role.list.creatTime'),
  dataIndex: 'creatTime',
  slotName: 'createTime'
}, {
  title: t('role.list.operations'),
  dataIndex: 'operations',
  slotName: 'operations',
},]
// ==========================事件响应模块==========================
// 初始化列表数据
const initRoleList = async () => {
  const res = await getRolePageList(pagination);
  roleList.value = res.data;
}
// 新增角色
const addRole = () => {
  addRoleRef.value.handleAddRoleVisible(true);
}
// 删除角色
const handleDelete = async (record) => {
  const res = await deleteRole(record.id)
  if (res.success) {
    Message.success(t('role.response.delete'));
    initRoleList()
  } else {
    Message.error(res.errMessage);
  }
}
// 编辑角色
const handleEdit = (record) => {
  editRoleRef.value.handleEditRoleVisible(true);

}
// 切换分页
const changePageIndex = (val) => {
  pagination.pageIndex = val;
  initRoleList()
}
onMounted(() => {
  // 动态计算表格的高度并进行分页
  const height =
    document.documentElement.clientHeight - header.value.offsetHeight - 350;
  tableHeight.value = height;
  pagination.pageSize = Math.floor(height / 50);
  initRoleList()

})
</script>
<style scoped lang="less">
.paginationStyle {
  justify-content: end;
  margin-top: 20px;
}
</style>