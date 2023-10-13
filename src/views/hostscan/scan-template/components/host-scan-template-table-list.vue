<template>
  <!--数据搜索模块 start-->
  <div ref="header">
    <a-row>
      <a-col :flex="1">
        <a-form :model="pagination" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item
                field="templateName"
                :label="t('scan.template.templateName')"
              >
                <a-input
                  v-model="pagination.templateName"
                  :placeholder="t('scan.template.name.input')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="tcpPort"
                :label="t('scan.template.serviceDiscovery.tcpPort')"
              >
                <a-input
                  v-model="pagination.tcpPort"
                  :placeholder="
                    t('scan.template.serviceDiscovery.input.tcpPort')
                  "
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="udpPort"
                :label="t('scan.template.serviceDiscovery.udpPort')"
              >
                <a-input
                  v-model="pagination.udpPort"
                  :placeholder="
                    t('scan.template.serviceDiscovery.input.udpPort')
                  "
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item
                field="enableIcmp"
                :label="t('scan.template.hostDiscovery.enableIcmp')"
              >
                <a-select
                  v-model="pagination.enableIcmp"
                  :placeholder="
                    t('scan.template.hostDiscovery.enableIcmp.input')
                  "
                  allow-clear
                  :options="commonOptions"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="enableArp"
                :label="t('scan.template.hostDiscovery.enableArp')"
              >
                <a-select
                  v-model="pagination.enableArp"
                  :placeholder="
                    t('scan.template.hostDiscovery.enableArp.input')
                  "
                  allow-clear
                  :options="commonOptions"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="portScanSpeed"
                :label="t('scan.template.performance.portScanSpeed')"
              >
                <a-select
                  v-model="pagination.portScanSpeed"
                  :placeholder="
                    t('scan.template.performance.portScanSpeed.input')
                  "
                  allow-clear
                  :options="speedOptions"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <!-- 查询&重置按钮start -->
      <a-divider style="height: 84px" direction="vertical"></a-divider>
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="vertical" :size="18">
          <a-button
            type="primary"
            default-checked
            style="margin: 0 10px"
            @click="initHostScanTemplateList"
          >
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
      <!-- 查询&重置按钮end -->
    </a-row>
    <!--数据搜索模块 end-->
    <a-divider style="margin-top: 0"></a-divider>
    <!-- 新增按钮start -->
    <a-row style="margin-bottom: 16px">
      <a-col
        :span="24"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <a-space>
          <a-button type="primary" @click="addScanTemplate">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('scan.template.add') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </div>
  <!--主机扫描模板数据表格 start-->
  <a-table
    row-key="id"
    :columns="columns"
    :style="{ height: tableHeight + 'px' }"
    :data="tableData"
    :bordered="false"
    :pagination="false"
    @sorter-change="sortedChangeEvent"
  >
    <template #templateName="{ record }">
      <a-link :hoverable="false" @click="handleDetail(record.id)">{{
        record.templateName
      }}</a-link>
    </template>
    <template #portScanSpeed="{ record }">
      {{ t(PortScanSpeedEnum[record.portScanSpeed]) }}
    </template>
    <template #enableIcmp="{ record }">
      {{ t(BoolEnum[record.enableIcmp]) }}
    </template>
    <template #enableArp="{ record }">
      {{ t(BoolEnum[record.enableArp]) }}
    </template>
    <template #enableSyn="{ record }">
      {{ t(BoolEnum[record.enableSyn]) }}
    </template>
    <template #enablePu="{ record }">
      {{ t(BoolEnum[record.enablePu]) }}
    </template>
    <template #operations="{ record }">
      <a-button
        type="text"
        size="small"
        style="padding: 0px"
        @click="editTemplate(record)"
      >
        {{ $t('scan.template.operator.edit') }}
      </a-button>
      <a-popconfirm
        :content="t('scan.template.operator.delete.question')"
        @ok="deleteTemplate(record)"
      >
        <a-button type="text" size="small" style="color: red">
          {{ $t('scan.template.operator.delete') }}
        </a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-pagination
    class="paginationStyle"
    :total="pagination.total"
    :current="pagination.pageIndex"
    :page-size="pagination.pageSize"
    show-total
    @change="changePageIndex"
  />
  <!--主机扫描模板数据表格 end-->
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    getScanTemplates,
    HostScanTemplateRes,
    PortScanSpeedEnum,
    FieldSortedEnum,
    deleteScanTemplates,
  } from '@/api/scan/scan-template';
  import BoolEnum from '@/api/common/enums';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  const { t } = useI18n();

  // ==========================数据定义模块==========================
  // 扫描引擎表头
  const columns = [
    {
      title: t('scan.template.templateName'),
      dataIndex: 'templateName',
      sortable: {
        sorter: true,
      },
      slotName: 'templateName',
    },
    {
      title: t('scan.template.hostDiscovery.enableIcmp'),
      dataIndex: 'enableIcmp',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'enableIcmp',
    },
    {
      title: t('scan.template.hostDiscovery.enableArp'),
      dataIndex: 'enableArp',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'enableArp',
    },
    {
      title: t('scan.template.hostDiscovery.synPort'),
      dataIndex: 'synPort',
      slotName: 'synPort',
    },
    {
      title: t('scan.template.hostDiscovery.puPort'),
      dataIndex: 'puPort',
      slotName: 'puPort',
    },
    {
      title: t('scan.template.serviceDiscovery.tcpPort'),
      dataIndex: 'tcpPort',
      slotName: 'tcpPort',
    },
    {
      title: t('scan.template.serviceDiscovery.udpPort'),
      dataIndex: 'udpPort',
      slotName: 'udpPort',
    },
    {
      title: t('scan.template.performance.portScanSpeed'),
      dataIndex: 'performance.portScanSpeed',
      slotName: 'portScanSpeed',
    },
    {
      title: t('scan.engine.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ];
  // 头部实例用来动态计算高度
  const header = ref();
  // 表格高度
  const tableHeight = ref(0);
  // 主机扫描模板表格数据
  const tableData = ref<HostScanTemplateRes>([]);
  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    order: 'desc',
    sort: 'createTime',
    templateName: '',
    tcpPort: '',
    udpPort: '',
    enableArp: '',
    enableIcmp: '',
    portScanSpeed: '',
  });
  // 搜索框select下拉框
  // 扫描速度下拉项
  const speedOptions = [
    {
      value: 'T1',
      label: t('scan.template.port.scan.t1'),
    },
    {
      value: 'T2',
      label: t('scan.template.port.scan.t2'),
    },
    {
      value: 'T3',
      label: t('scan.template.port.scan.t3'),
    },
    {
      value: 'T4',
      label: t('scan.template.port.scan.t4'),
    },
    {
      value: 'T5',
      label: t('scan.template.port.scan.t5'),
    },
  ];
  // Arp&Icmp下拉项
  const commonOptions = [
    {
      value: '1',
      label: t('form.enable.true'),
    },
    {
      value: '0',
      label: t('form.enable.false'),
    },
  ];
  // 引入路由方法
  const router = useRouter();

  // ==========================数据操纵模块==========================
  // 初始化引擎列表
  const initHostScanTemplateList = async () => {
    const response = await getScanTemplates(pagination.value);
    tableData.value = response.data;
    // 分页参数赋值
    pagination.value.total = response.totalCount;
    pagination.value.pageIndex = response.pageIndex;
    pagination.value.pageSize = response.pageSize;
  };

  // 当页面加载时，显示数据
  onMounted(() => {
    // 动态计算表格的高度并进行分页
    const height =
      document.documentElement.clientHeight - header.value.offsetHeight - 350;
    tableHeight.value = height;
    pagination.value.pageSize = Math.floor(height / 50);
    // 初始化页面表格数据
    initHostScanTemplateList();
    // window.onresize = () => {
    //   const height = document.documentElement.clientHeight - header.value.offsetHeight - 200;
    //   pagination.value.pageIndex = Math.floor(height / 50);
    // }
  });

  // ==========================事件响应模块==========================
  // 过滤后端排序字段
  function filterSortedField(field) {
    const filterField = FieldSortedEnum[field];
    if (filterField) {
      field = filterField;
    }
    return field;
  }
  // 排序事件触发 后端排序
  const sortedChangeEvent = (field, direction) => {
    direction = direction === 'descend' ? 'desc' : 'asc';
    // 过滤得到后端支持的排序字段
    field = filterSortedField(field);
    pagination.value.sort = field;
    pagination.value.order = direction;
    // 重新刷新列表
    initHostScanTemplateList();
  };
  // 重置事件
  const reset = () => {
    pagination.value.order = 'desc';
    pagination.value.sort = 'createTime';
    pagination.value.templateName = '';
    pagination.value.tcpPort = '';
    pagination.value.udpPort = '';
    pagination.value.enableArp = '';
    pagination.value.enableIcmp = '';
    pagination.value.portScanSpeed = '';
    initHostScanTemplateList();
  };
  // 编辑
  const editTemplate = (record) => {
    router.push({
      name: 'editTemplate',
      query: {
        templateId: record.id,
      },
    });
  };
  // 删除
  const deleteTemplate = async (record) => {
    try {
      const data = await deleteScanTemplates(record.id);
      if (data.success) {
        Message.success(t('scan.delete.template.success'));
        initHostScanTemplateList();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 新增
  const addScanTemplate = () => {
    router.push({
      name: 'addTemplate',
    });
  };
  // 详情
  const handleDetail = (templateId: string) => {
    router.push({
      name: 'showTemplate',
      query: {
        templateId,
      },
    });
  };
  // 改变页码
  const changePageIndex = (val) => {
    pagination.value.pageIndex = val;
    initHostScanTemplateList();
  };
</script>

<style scoped lang="less">
  .paginationStyle {
    justify-content: end;
    margin-top: 20px;
  }
</style>
