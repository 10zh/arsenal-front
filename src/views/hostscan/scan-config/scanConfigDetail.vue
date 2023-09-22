<template>
  <div class="container">
    <Breadcrumb :items="[
      'menu.hostscan',
      'menu.list.scan.config',
      'menu.list.configDetail',
    ]" />
    <a-card style="margin-bottom: 20px" ref="topCardRefs">
      <div style="text-align: right">
        <a-button type="primary" @click="goBack" style="margin-bottom: 10px; margin-right: 1%" size="mini">返回</a-button>
      </div>
      <div class="content-top">
        <div style="display: flex; justify-content: space-around">
          <div :class="[theme === 'dark' ? 'dark' : 'light', 'content-top-info']">
            <span>{{ t('host.scan.config.scanStatus') }} </span>
            <a-tag :color="getStatusColor(info.scanStatus)">{{ getStatusText(info.scanStatus) }}
            </a-tag>
          </div>
          <div :class="[theme === 'dark' ? 'dark' : 'light', 'content-top-info']">
            <span style="margin-top: 20px">{{
              t('host.scan.config.scanPress')
            }}</span>
            <div>
              <a-progress :percent="info.processBar / 100" type="circle" trackColor="var(--color-primary-light-1)" />
            </div>
          </div>
          <div :class="[theme === 'dark' ? 'dark' : 'light', 'content-top-info']">
            <span>{{ t('host.scan.config.scanCostTime') }}</span>
            <div class="info-times">
              <span class="text">{{ info.scanCostTime }}</span>
              <span class="unit">s</span>
            </div>
          </div>
          <div :class="[theme === 'dark' ? 'dark' : 'light', 'content-top-info']">
            <span>{{ t('host.scan.config.scanGoal') }}</span>
            <div class="info-times">
              <span class="text">{{ info.scanGoal }}</span>
            </div>
          </div>
          <div :class="[theme === 'dark' ? 'dark' : 'light', 'content-top-info']">
            <span>{{ t('host.scan.config.vulnerabilityNumber') }}</span>
            <div class="info-times">
              <span class="text">{{ info.vulnerabilityNumber }}</span>
              <span class="unit">个</span>
            </div>
          </div>
          <div :class="[theme === 'dark' ? 'dark' : 'light', 'content-top-info']">
            <span>{{ t('host.scan.config.hostNumber') }}</span>
            <div class="info-times">
              <span class="text">{{ info.hostNumber }}</span>
              <span class="unit">个</span>
            </div>
          </div>
        </div>
      </div>
    </a-card>

    <a-card :style="'height:' + cardHeight + 'px'">
      <div style="display: flex; justify-content: center">
        <div class="content-right">
          <div class="content-right-wrap">
            <SettingTable :popColumns="popColumsBug" :columns="columnsBug" :tabsKey="tabsKey2" v-if="tabsKey2 === '5'"
              @handleChange2="handleChange2"></SettingTable>
            <a-tabs style="flex: 1; padding: 0 10px" @tab-click="tabClick">
              <a-tab-pane title="主机" key="4">
                <a-table row-key="id" :columns="hostColumns" :bordered="false" :data="tableData"
                  :row-selection="rowSelection" :pagination="false" :style="'height:' + (cardHeight - 150) + 'px'">
                  <template #ipv4="{ record }">
                    <a-link href="#" @click="handleHostName(record)">{{
                      record.ipv4
                    }}</a-link>
                  </template>
                </a-table>
                <a-pagination class="pagination-style" :total="pagination.total" :current="pagination.pageIndex"
                  :page-size="pagination.pageSize" show-total show-jumper show-page-size />
              </a-tab-pane>
              <a-tab-pane title="漏洞" key="5">
                <HostBugTable :cardHeight="cardHeight" :cloneColumns="columnsBug" :hostBugData="tableDataBug"
                  :paginationBug="paginationBug">
                </HostBugTable>
              </a-tab-pane>
            </a-tabs>
          </div>
        </div>
        <a-divider direction="vertical" :style="'height:' + (cardHeight - 100) + 'px'" />
        <div class="content-right">
          <div v-if="isClick === true" class="content-right-wrap">
            <SettingTable :popColumns="popColums" :tabsKey="tabsKey" :columns="columns" @handleChange2="handleChange"
              v-if="tabsKey != '3'"></SettingTable>
            <a-tabs @tab-click="handleHostTab">
              <a-tab-pane title="主机详情" key="3" style="margin: auto">
                <HostDetailCard :hostInfo="hostInfo" :cardHeight="cardHeight"></HostDetailCard>
              </a-tab-pane>
              <a-tab-pane title="主机服务" key="1">
                <a-table row-key="id" :style="'height:' + (cardHeight - 150) + 'px'" :span-method="arraySpanMethod"
                  :columns="(cloneColumns as TableColumnData[])" :bordered="{ cell: true }" :data="hostServiceData"
                  :row-selection="rowSelection" :pagination="false">
                  <template #banner="{ record }">
                    <a-tooltip content-class="popStyle" position="top" background-color="#fff">
                      <p class="text-over"> {{ record.banner }}</p>
                      <template #content>
                        <p style="width: 500px; color: #333">{{
                          record.banner
                        }}</p>
                      </template>
                    </a-tooltip>
                  </template>
                  <template #hierarchical="{ record }">
                    <a-tag :color="setColor(record.hierarchical)">{{
                      getLevelText(record.hierarchical)
                    }}</a-tag>
                  </template>
                </a-table>
                <a-pagination class="pagination-style" :total="pagination1.total" :current="pagination1.pageIndex"
                  :page-size="pagination1.pageSize" show-total show-jumper show-page-size />
              </a-tab-pane>
              <a-tab-pane title="主机漏洞" key="2">
                <HostBugTable :cardHeight="cardHeight" :cloneColumns="cloneColumns" :hostBugData="hostBugData"
                  :paginationBug="pagination2">
                </HostBugTable>
              </a-tab-pane>
            </a-tabs>
          </div>
          <a-empty style="margin: auto" v-else />
        </div>
      </div>
    </a-card>
  </div>
</template>
    j
<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from 'vue';
import {
  getScanHostList,
  configHostRes,
  getScanBugList,
  getScanProgress,
  getHostDetail,
  getHostServiceList,
  getHostBugList,
  HostServiceRes,
} from '@/api/scan/scan-config';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';
import Sortable, { mount } from 'sortablejs';
import cloneDeep from 'lodash/cloneDeep';

import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import {
  getLevelText,
  getStatusText,
  getStatusColor,
  getSeverityRatingText,
  setSeverityRatingColor,
} from '@/hooks/status-options';
import SettingTable from '@/components/setting-table/index.vue';
import HostDetailCard from './components/host-detail-card.vue';
import HostBugTable from './components/host-bug-table.vue';

const pagination = ref({
  pageIndex: 1,
  total: 1,
  pageSize: 10,
});
const route = useRoute();
const scanId = ref<string>('');
const tableData = ref<configHostRes[]>([]);
scanId.value = route.query.scanId;
const { t } = useI18n();
const appStore = useAppStore();
// 主机表格属性
const hostColumns = [
  {
    title: t('host.scan.hostConfig.hostName'),
    dataIndex: 'hostName',
    slotName: 'hostName',
  },
  {
    title: t('host.scan.hostConfig.macAddress'),
    dataIndex: 'macAddress',
  },
  {
    title: t('host.scan.hostConfig.osName'),
    dataIndex: 'osName',
  },
  {
    title: t('host.scan.hostConfig.IPV4'),
    dataIndex: 'ipv4',
    slotName: 'ipv4',
  },
  {
    title: t('host.scan.hostConfig.IPV6'),
    dataIndex: 'ipv6',
  },
];
// 漏洞表格属性
const bugColumns = [
  {
    title: t('host.scan.hostConfig.accuracy'),
    dataIndex: 'accuracy',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.componentName'),
    dataIndex: 'componentName',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.potential'),
    dataIndex: 'potential',
    isShow: true,
    slotName: 'potential',
  },
  {
    title: t('host.scan.hostConfig.safe'),
    dataIndex: 'safe',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.severity'),
    dataIndex: 'severity',
    isShow: true,
    slotName: 'severity',
  },
  {
    title: t('host.scan.hostConfig.vulnName'),
    dataIndex: 'vulnName',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.IPV4'),
    dataIndex: 'ipv4',
  },
  {
    title: t('host.scan.hostConfig.IPV6'),
    dataIndex: 'ipv6',
  },
  {
    title: t('host.scan.hostConfig.proof'),
    dataIndex: 'proof',
    slotName: 'proof',
  },
];
// 主机
const getTableList = async () => {
  const data = await getScanHostList(scanId.value, pagination.value);
  tableData.value = data.data;
};
const tableDataBug = ref<configHostRes[]>([]);
// 漏洞的分页列表
const paginationBug = ref({
  pageIndex: 1,
  total: 1,
  pageSize: 10,
});
// 漏洞
type Column = TableColumnData & { checked?: true };
const columns = ref<Column[]>([]);
const popColums = ref<Column[]>([]);
const columnsBug = ref<Column[]>([]);
const popColumsBug = ref<Column[]>([]);
const tabsKey2 = ref<string>('4');
const getTableListBug = async (key?: string) => {
  const data = await getScanBugList(scanId.value, paginationBug.value);
  tableDataBug.value = data.data;
  paginationBug.value.total = data.totalCount;
  popColumsBug.value = bugColumns;
  tabsKey2.value = key;

  columnsBug.value = bugColumns.filter((item) => item.isShow === true);
  console.log(columnsBug);
};
// tab标签切换事件
const tabsKey = ref<string>('3');

const tabClick = (key: string) => {
  if (key === '4') {
    getTableList();
  } else {
    getTableListBug(key);
  }
};
const router = useRouter();
const goBack = () => {
  router.push({ path: '/hostscan/scanConfig' });
};
interface infoRes {
  hostNumber: number;
  processBar: number;
  scanCostTime: number;
  scanGoal: string;
  scanStatus: number;
  vulnerabilityNumber: number;
}
const info = ref<infoRes>({
  hostNumber: 0,
  processBar: 0,
  scanCostTime: 0,
  scanGoal: '',
  scanStatus: 1,
  vulnerabilityNumber: 1,
});
const getDetailInfo = async () => {
  const data = await getScanProgress(scanId.value);
  info.value = data.data;
};
// 主机详情数据
interface hostDetailRes {
  city: string;
  country: string;
  domain: string;
  fqdn: string;
  hostType: string;
  ipv4: string;
  ipv6: string;
  isp: string;
  province: string;
  region: string;
  macAddress: string;
  osName: string;
}
const hostInfo = ref<hostDetailRes>({
  city: '',
  country: '',
  domain: '',
  fqdn: '',
  hostType: '',
  isp: '',
  province: '',
  region: '',
  ipv4: '',
  ipv6: '',
  osName: '',
  macAddress: '',
});
const isClick = ref<boolean>(false);
const recordValue = ref(null);
// 点击主机名
const handleHostName = async (record: configHostRes) => {
  isClick.value = true;
  recordValue.value = record;
  // 获取主机详情
  const data1 = await getHostDetail(scanId.value, record.id);
  hostInfo.value = data1.data;
};
// 主机服务表格属性
const serviceColumns = [
  {
    title: t('host.scan.hostConfig.accuracy'),
    dataIndex: 'accuracy',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.applicationProtocol'),
    dataIndex: 'applicationProtocol',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.banner'),
    dataIndex: 'banner',
    slotName: 'banner',
  },
  {
    title: t('host.scan.hostConfig.certificate'),
    dataIndex: 'certificate',
  },
  {
    title: t('host.scan.hostConfig.componentsMessage'),
    isShow: true,
    children: [
      {
        title: t('host.scan.hostConfig.hierarchical'),
        dataIndex: 'hierarchical',
        slotName: 'hierarchical',
      },
      {
        title: t('host.scan.hostConfig.name'),
        dataIndex: 'name',
      },
      {
        title: t('host.scan.hostConfig.version'),
        dataIndex: 'version',
      },
    ],
  },
  {
    title: t('host.scan.hostConfig.httpHeader'),
    dataIndex: 'httpHeader',
  },
  {
    title: t('host.scan.hostConfig.httpTitle'),
    dataIndex: 'httpTitle',
  },
  {
    title: t('host.scan.hostConfig.httpUrl'),
    dataIndex: 'httpUrl',
  },
  {
    title: t('host.scan.hostConfig.port'),
    dataIndex: 'port',
    isShow: true,
  },
  {
    title: t('host.scan.hostConfig.proof'),
    dataIndex: 'proof',
  },
  {
    title: t('host.scan.hostConfig.transportProtocol'),
    dataIndex: 'transportProtocol',
  },
  {
    title: t('host.scan.hostConfig.unMatchBanner'),
    dataIndex: 'unMatchBanner',
  },
];
// 需要合并的列
const mergeArr = ref([
  'accuracy',
  'applicationProtocol',
  'certificate',
  'httpHeader',
  'httpTitle',
  'httpUrl',
  'port',
  'proof',
  'transportProtocol',
  'banner',
  'unMatchBanner',
]);
const mergeObj = ref({
  accuracy: '',
  applicationProtocol: '',
  banner: '',
  certificate: '',
  httpHeader: '',
  httpTitle: '',
  httpUrl: '',
  port: '',
  proof: '',
  transportProtocol: '',
  unMatchBanner: '',
});
const hostServiceData = ref<HostServiceRes[]>([]);
// 处理合并数据
const rowspan = () => {
  mergeArr.value.forEach((key: string) => {
    let count = 0;
    mergeObj.value[key] = []; // 记录每一列的合并信息
    hostServiceData.value.forEach((item: HostServiceRes, index: number) => {
      // index == 0表示数据为第一行，直接 push 一个 1
      if (index === 0) {
        mergeObj.value[key].push(1);
      } else if (index > 0) {
        // 判断当前行是否与上一行其值与id是否相等 如果相等 在 count 记录的位置其值 +1 表示当前行需要合并 并push 一个 0 作为占位
        if (
          item[key] === hostServiceData.value[index - 1][key] &&
          item.id === hostServiceData.value[index - 1].id
        ) {
          mergeObj.value[key][count] += 1;
          mergeObj.value[key].push(0);
        } else {
          // 如果当前行和上一行其值不相等
          count = index; // 记录当前位置
          mergeObj.value[key].push(1); // 重新push 一个 1
        }
      }
    });
  });
};
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (column.dataIndex && mergeArr.value.indexOf(column.dataIndex) !== -1) {
    if (
      mergeObj.value[column.dataIndex] &&
      mergeObj.value[column.dataIndex][rowIndex]
    ) {
      return {
        rowspan: mergeObj.value[column.dataIndex][rowIndex],
        colspan: 1,
      };
    }
    return {
      rowspan: 0,
      colspan: 0,
    };
  }
  return {
    rowspan: 1,
    colspan: 1,
  };
};
interface componentsRes {
  hierarchical: string;
  name: string;
  version: string;
}
// 初始化数据
const getData = () => {
  const newArr: HostServiceRes[] = [];
  hostServiceData.value.forEach((item: HostServiceRes, index: number) => {
    const string1 = {
      orderNumber: index + 1,
      accuracy: item.accuracy,
      applicationProtocol: item.applicationProtocol,
      certificate: item.certificate,
      banner: item.banner,
      httpHeader: item.httpHeader,
      httpTitle: item.httpTitle,
      httpUrl: item.httpUrl,
      port: item.port,
      proof: item.proof,
      transportProtocol: item.transportProtocol,
      unMatchBanner: item.unMatchBanner,
    };
    const student: componentsRes[] = item.components;
    if (!item.components || student.length === 0) {
      string1.hierarchical = '-';
      string1.name = '-';
      string1.version = '-';
      newArr.push(JSON.parse(JSON.stringify(string1)));
    } else {
      student.forEach((item2: componentsRes) => {
        string1.hierarchical = item2.hierarchical;
        string1.name = item2.name;
        string1.version = item2.version;
        newArr.push(JSON.parse(JSON.stringify(string1)));
      });
    }
  });
  hostServiceData.value = newArr;
  rowspan();
};
const hostBugData = ref();
// 主机服务分页参数
const pagination1 = ref({
  pageIndex: 1,
  pageSize: 5,
  total: 1,
});
// 主机漏洞分页参数
const pagination2 = ref({
  pageIndex: 1,
  pageSize: 5,
  total: 1,
});
// tab栏切换
const handleHostTab = async (key: string) => {
  if (key === '1') {
    const data2 = await getHostServiceList(
      scanId.value,
      recordValue.value.id,
      pagination1.value
    );
    hostServiceData.value = data2.data;
    hostServiceData.value = hostServiceData.value.map((item, index) => {
      return {
        id: index,
        ...item,
      };
    });
    popColums.value = serviceColumns;
    columns.value = serviceColumns.filter((item) => item.isShow === true);
    getData();
    tabsKey.value = key;
  } else if (key === '2') {
    const data3 = await getHostBugList(
      scanId.value,
      recordValue.value.id,
      pagination2.value
    );
    hostBugData.value = data3.data;
    popColums.value = bugColumns;
    columns.value = bugColumns.filter((item) => item.isShow === true);
    tabsKey.value = key;
  } else {
    const data1 = await getHostDetail(scanId.value, recordValue.value.id);
    hostInfo.value = data1.data;
  }
};
// 点击设置列表
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = cloneColumns.value.filter(
      (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
};
// 漏洞设置表单触发
const handleChange2 = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    columnsBug.value = columnsBug.value.filter(
      (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    columnsBug.value.splice(index, 0, column);
  }
};

watch(
  () => popColums.value,
  (val) => {
    cloneColumns.value = cloneDeep(columns.value);
    cloneColumns.value.forEach((item, index) => {
      popColums.value.forEach((item2, index2) => {
        if (item.dataIndex === item2.dataIndex) {
          item2.checked = true;
        }
      });
    });
    showColumns.value = cloneDeep(popColums.value);
  },
  { deep: true, immediate: true }
);
// 计算下方card高度
const cardHeight = ref<number>(0);
const topCardRefs = ref(null);
onMounted(() => {
  cardHeight.value =
    document.documentElement.clientHeight -
    topCardRefs.value.$el.clientHeight -
    200;
  pagination.value.pageSize = Math.floor((cardHeight.value - 200) / 43);
  paginationBug.value.pageSize = Math.floor((cardHeight.value - 200) / 43);
  pagination1.value.pageSize = Math.floor((cardHeight.value - 200) / 43);
  pagination2.value.pageSize = Math.floor((cardHeight.value - 200) / 43);
  getTableList();
  getDetailInfo();
});
// 主题模式切换
const theme = computed(() => {
  return appStore.theme;
});
// 主题模式切换
const setColor = (status: number) => {
  const map1 = {
    1: 'cyan',
    2: 'orange',
    3: 'blue',
    4: 'purple',
  };
  return map1[status];
};
</script>
<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.dark {
  background: #333;
}

.light {
  background: #f1f1f1;
}

.content {
  &-right {
    flex: 1;
    // border: 1px solid #ccc;
    // padding: 0 10px;
    width: 50%;
    // margin-top: 30px;
    // margin-left: 20px;
    display: flex;
    align-content: center;

    &-wrap {
      width: 100%;
      position: relative;
    }
  }

  &-top {
    &-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      width: 15%;
      border-radius: 10px;
      padding: 0 0 15px 0px;

      >span {
        font-size: 17px;
        display: inline-block;
        margin: 10px 0;
        // font-weight: 700;
      }

      .info-times {
        display: flex;
        align-items: baseline;
      }

      .text {
        font-size: 30px;
        color: #3e73ff;
      }

      .unit {
        font-size: 14px;
      }
    }
  }
}

// ::v-deep .arco-tabs-nav-ink {
//   top: 5px !important;

// }
::v-deep .arco-tabs-nav::before {
  height: 0px !important;
}

.pagination-style {
  justify-content: end;
}

::v-deep .arco-form-item-label {
  width: 65px;
}

.action {
  &-icon {
    display: flex;
    align-items: center;
  }
}

.setting {
  &-pop {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 9999;
  }
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

.text-over {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  width: 200px;
}

.container-type {
  container-type: inline-size;
  container-name: card;
  padding: 0 10px;
}

@container card (max-width: 900px) {

  /* Horizontal style. */
  .auto-height {
    display: flex;
    flex-wrap: wrap;

    >div {
      margin: 0 10px;
      width: 400px;
    }
  }
}

@container card (max-width: 850px) {

  /* Horizontal style. */
  .auto-height {
    display: flex;
    flex-wrap: wrap;

    >div {
      margin: 0 10px;
      width: 320px;
    }
  }
}
</style>
<style>
.popStyle {
  max-width: 100% !important;
}
</style>