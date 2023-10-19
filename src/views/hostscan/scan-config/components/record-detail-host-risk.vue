<template>
  <a-row ref="header">
    <a-col :flex="1">
      <a-form
        :model="vulnerabilityPagination"
        auto-label-width
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="left"
      >
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="$t('scan.record.vulnName')">
              <a-input
                v-model="vulnerabilityPagination.vulnName"
                :placeholder="t('scan.record.vulnName.input')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('scan.record.ipv4')">
              <a-input
                v-model="vulnerabilityPagination.ipv4"
                :placeholder="t('scan.record.ipv4.input')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('scan.record.ipv6')">
              <a-input
                v-model="vulnerabilityPagination.ipv6"
                :placeholder="t('scan.record.ipv6.input')"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item :label="$t('scan.record.componentName')">
              <a-input
                v-model="vulnerabilityPagination.componentName"
                :placeholder="t('scan.record.componentName.input')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item :label="$t('scan.record.port')">
              <a-input
                v-model="vulnerabilityPagination.port"
                :placeholder="t('scan.record.port.input')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="section" :label="t('scan.record.potential')">
              <a-select
                v-model="vulnerabilityPagination.potential"
                placeholder="Please select"
                allow-clear
              >
                <a-option value="1">{{ t('global.true') }}</a-option>
                <a-option value="0">{{ t('global.false') }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item field="section" :label="t('scan.record.safe')">
              <a-select
                v-model="vulnerabilityPagination.safe"
                placeholder="Please select"
                allow-clear
              >
                <a-option value="1">{{ t('global.true') }}</a-option>
                <a-option value="0">{{ t('global.false') }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-button
              type="primary"
              default-checked
              style="margin: 0 10px"
              @click="initHostVulnerabilityData"
            >
              <template #icon>
                <icon-search />
              </template>
              {{ $t('global.search') }}
            </a-button>
            <a-button style="margin: 0 10px" @click="resetVulnerabilityList">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('global.reset') }}
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
  <a-table
    :columns="vulnerabilityTableColumns"
    :data="vulnerabilityData"
    column-resize
    :pagination="false"
    :bordered="{ cell: true }"
    :style="{ height: tabsHeight + 'px' }"
    @sorter-change="sortedChangeEvent"
  >
    <template #potential="{ record }">
      {{ record.potential ? t('global.true') : t('global.false') }}
    </template>
    <template #safe="{ record }">
      {{ record.safe ? t('global.true') : t('global.false') }}
    </template>
  </a-table>
  <a-pagination
    class="paginationStyle"
    :total="vulnerabilityPagination.total"
    :current="vulnerabilityPagination.pageIndex"
    :page-size="vulnerabilityPagination.pageSize"
    show-total
    show-jumper
    show-page-size
    @change="handleVulnerabilityPageIndexChange"
    @page-size-change="handleVulnerabilityPageSizeChange"
  />
</template>

<script setup>
  // ==========================声明模块==========================
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import { getHostVulnerabilityListRecordByScanHostId } from '@/api/scan/scan-record';

  // ==========================数据定义模块==========================
  const { t } = useI18n();
  const route = useRoute();
  // 漏洞列表表头
  const vulnerabilityTableColumns = reactive([
    {
      title: t('scan.record.vulnName'),
      dataIndex: 'vulnName',
      sortable: {
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      width: 200,
    },
    {
      title: t('scan.record.ipv4'),
      dataIndex: 'ipv4',
      sortable: {
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      width: 150,
    },
    {
      title: t('scan.record.ipv6'),
      dataIndex: 'ipv6',
      sortable: {
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      width: 100,
    },
    {
      title: t('scan.record.port'),
      dataIndex: 'port',
      sortable: {
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      width: 100,
    },
    {
      title: t('scan.record.componentName'),
      dataIndex: 'componentName',
      sortable: {
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      width: 120,
    },
    {
      title: t('scan.record.proof'),
      dataIndex: 'proof',
      ellipsis: true,
      tooltip: { position: 'top' },
      width: 100,
    },
    {
      title: t('scan.record.safe'),
      dataIndex: 'safe',
      slotName: 'safe',
      width: 100,
    },
    {
      title: t('scan.record.potential'),
      dataIndex: 'potential',
      slotName: 'potential',
      width: 100,
    },
    {
      title: t('scan.record.accuracy'),
      dataIndex: 'accuracy',
      sortable: {
        sorter: true,
        sortDirections: ['descend', 'ascend'],
      },
      width: 120,
    },
    {
      title: t('scan.record.severity'),
      dataIndex: 'severity',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
      width: 120,
    },
  ]);
  // 扫描配置ID
  const { scanId, hostId } = route.query;
  // 漏洞列表分页参数
  const vulnerabilityPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    order: 'desc',
    sort: 'severity',
    vulnName: '',
    ipv4: '',
    ipv6: '',
    componentName: '',
    port: '',
    potential: '',
    safe: '',
  });
  // 卡片高度
  const tabsHeight = ref();
  // 头部实例
  const header = ref();
  // 漏洞列表数据
  const vulnerabilityData = ref([]);
  // ==========================数据操纵模块==========================
  // 初始化漏洞列表数据
  const initHostVulnerabilityData = async () => {
    const response = await getHostVulnerabilityListRecordByScanHostId(
      scanId,
      hostId,
      vulnerabilityPagination.value
    );
    vulnerabilityData.value = response.data;
    vulnerabilityPagination.value.total = response.totalCount;
    vulnerabilityPagination.value.pageIndex = response.pageIndex;
    vulnerabilityPagination.value.pageSize = response.pageSize;
  };
  // 重置漏洞列表事件
  const resetVulnerabilityList = () => {
    vulnerabilityPagination.value.vulnName = '';
    vulnerabilityPagination.value.ipv4 = '';
    vulnerabilityPagination.value.ipv6 = '';
    vulnerabilityPagination.value.componentName = '';
    vulnerabilityPagination.value.port = '';
    vulnerabilityPagination.value.potential = '';
    vulnerabilityPagination.value.safe = '';
    initHostVulnerabilityData();
  };
  // 漏洞列表分页事件
  const handleVulnerabilityPageIndexChange = (pageIndex) => {
    vulnerabilityPagination.value.pageIndex = pageIndex;
    initHostVulnerabilityData();
  };
  // 漏洞分页事件
  const handleVulnerabilityPageSizeChange = (pageSize) => {
    vulnerabilityPagination.value.pageSize = pageSize;
    initHostVulnerabilityData();
  };
  // 排序事件
  const sortedChangeEvent = (field, direction) => {
    direction = direction === 'descend' ? 'desc' : 'asc';
    vulnerabilityPagination.value.sort = field;
    vulnerabilityPagination.value.order = direction;
    // 重新刷新列表
    initHostVulnerabilityData();
  };
  onMounted(() => {
    // 动态计算高度
    const height =
      document.documentElement.clientHeight -
      header.value.$el.offsetHeight -
      300;
    tabsHeight.value = height;
    vulnerabilityPagination.value.pageSize = Math.floor(height / 50);
    initHostVulnerabilityData();
  });
</script>
