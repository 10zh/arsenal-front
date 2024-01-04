<template>
  <div ref="header">
    <!-- 表单数据start -->
    <a-row>

      <a-col :flex="1">
        <a-form :model="form" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="roleName" :label="t('role.list.roleName')">
                <a-input v-model="pagination.roleName" :placeholder="t('role.list.roleName')"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="creatTime" :label="t('role.list.creatTime')">
                <a-range-picker v-model="pagination.creatTime" :style="{ width: '100%' }" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="status" :label="t('role.list.status')">
                <a-input v-model="pagination.status" :placeholder="t('role.list.status')"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <!-- 表单数据end -->
          <!-- 查询&重置按钮start -->
          <a-row>
            <a-col>
              <a-space :size="18">
                <a-button type="primary" @click="initEngineList">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('global.search') }}
                </a-button>
                <a-button @click="reset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('global.reset') }}
                </a-button>
                <!-- 新增按钮 -->
                <a-button type="primary" @click="addRole">
                  <template #icon>
                    <icon-plus />
                  </template>
                  {{ $t('role.list.add') }}
                </a-button>
              </a-space>
            </a-col>
          </a-row>

        </a-form>
      </a-col>
    </a-row>
    <a-divider></a-divider>
    <!--数据搜索模块 end-->
  </div>
  <!-- 列表start -->
  <a-table row-key="id" :columns="columns" :pagination="false" :style="{ height: tableHeight + 'px' }" :data="roleList">
    <template #createTime="{ record }">
      <span>{{ formatDate(record.creatTime, 'YYYY-MM-DD hh:mm:ss') }}</span>

    </template>
    <template #status="{ record }">
      <a-switch v-model="record.status" :checked-value="0" :unchecked-value="1" />
    </template>
    <template #operations="{ record }">
      <a-button v-if="record.type === 'custom'" type="text" size="small" style="padding: 0 5px"
        @click="handleEdit(record)">

        {{ $t('manage.role.operator.edit') }}
      </a-button>
      <a-popconfirm :content="t('manage.role.operator.delete.question')" @ok="handleDelete(record)">
        <a-button type="text" v-if="record.type === 'custom'" status="danger" size="small">

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
  <!-- 分页栏 -->
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
  dataIndex: 'name',
},
// {
//   title: t('role.list.roleType'),
//   dataIndex: 'roleType',
// },
{
  title: t('role.list.userNum'),
  dataIndex: 'userNum',
}, {
  title: t('role.list.roleDescription'),
  dataIndex: 'roleDescription',
},
{
  title: t('role.list.createBy'),
  dataIndex: 'createBy',

}, {
  title: t('role.list.creatTime'),
  dataIndex: 'creatTime',
  slotName: 'createTime'
},
{
  title: t('role.list.status'),
  dataIndex: 'status',
  slotName: 'status'
},

{
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
  editRoleRef.value.handleEditRoleVisible(true, record.id);

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