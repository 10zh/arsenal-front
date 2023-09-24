<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.template']" />
    <a-card class="general-card" :title="$t('menu.list.scan.template')">
      <a-row ref="searchRef">
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="templateName"
                  :label="t('form.search.templateName')"
                >
                  <a-input v-model="formModel.templateName" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="performance.portScanSpeed"
                  :label="t('form.portScanSpeed')"
                >
                  <a-select
                    v-model="formModel.performance.portScanSpeed"
                    :options="singleAssetThreadOptions"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="enableIcmp"
                  :label="t('form.search.enableIcmp')"
                >
                  <a-select
                    v-model="formModel.hostDiscovery.enableIcmp"
                    :options="enableArpOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item
                  field="isLocal"
                  :label="t('form.search.enableArp')"
                >
                  <a-select
                    v-model="formModel.hostDiscovery.enableArp"
                    :options="enableArpOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-button type="primary" style="margin: 0 10px">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('searchTable.form.search') }}
                </a-button>
                <a-button style="margin: 0 10px">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('searchTable.form.reset') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col style="display: flex"> </a-col>
      </a-row>

      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAdd('add')">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.scanTemplate.create') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :columns="columns"
        :bordered="false"
        :data="tableData"
        :row-selection="rowSelection"
        :style="'height:' + cardHeight + 'px'"
        :pagination="false"
      >
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            style="padding: 10px"
            @click="handleListener('edit', record)"
          >
            <template #icon>
              <icon-edit />
            </template>
            {{ $t('button.edit') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            style="padding: 0px"
            @click="handleListener('detail', record)"
          >
            <template #icon>
              <icon-menu />
            </template>
            {{ $t('button.detail') }}
          </a-button>
        </template>
      </a-table>
      <a-pagination
        class="pagination-style"
        :total="pagination.total"
        :current="pagination.pageIndex"
        :page-size="pagination.pageSize"
        show-total
        show-jumper
        show-page-size
      />
    </a-card>

    <!-- <a-pagination :current="pagination.pageIndex"  :page-size="pagination.pageSize" :total="pagination.total"
      :hide-on-single-page="false" show-total show-jumper show-page-size /> -->
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import {
    HostScanTemplateRes,
    getScanTemplates,
  } from '@/api/scan/scan-template';
  import { useTemplateStore } from '@/store';

  const { t } = useI18n();
  const router = useRouter();
  const useTemplate = useTemplateStore();
  const cardHeight = ref<number>();
  const searchRef = ref();
  interface formData {
    templateName: string;
    assetConcurrency: string;
  }
  const formModel = reactive<HostScanTemplateRes>({
    hostDiscovery: {
      enableArp: '1',
      enableIcmp: '0',
      enablePu: '1',
      enableSyn: '1',
      maxRetries: 2,
      puPort: '53,5353',
      synPort: '1-1024',
    },
    performance: {
      assetConcurrency: 0,
      singleAssetThread: 5,
      portScanSpeed: 'T3',
    },
    serviceDiscovery: {
      tcpPort: '1-1024',
      udpPort: '53,5353',
    },
    templateName: '',
    message: '',
  });
  const enableArpOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('form.contentType.enableArp.true'),
      value: '1',
    },
    {
      label: t('form.contentType.enableArp.false'),
      value: '0',
    },
  ]);
  //  端口扫描速度
  const singleAssetThreadOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('form.contentType.portScanSpeed.T1'),
      value: 'T1',
    },
    {
      label: t('form.contentType.portScanSpeed.T2'),
      value: 'T2',
    },
    {
      label: t('form.contentType.portScanSpeed.T3'),
      value: 'T3',
    },
    {
      label: t('form.contentType.portScanSpeed.T4'),
      value: 'T4',
    },
    {
      label: t('form.contentType.portScanSpeed.T5'),
      value: 'T5',
    },
  ]);

  // 扫描模板表头
  const columns = [
    {
      title: t('host.scan.template.name'),
      dataIndex: 'templateName',
    },
    {
      title: t('asset.concurrent.number'),
      dataIndex: 'performance.assetConcurrency',
    },
    {
      title: t('single.asset.concurrent.number'),
      dataIndex: 'performance.singleAssetThread',
    },
    {
      title: t('port.scan.speed'),
      dataIndex: 'performance.portScanSpeed',
    },
    {
      title: t('service.tcp.port.list'),
      dataIndex: 'serviceDiscovery.tcpPort',
    },
    {
      title: t('service.udp.port.list'),
      dataIndex: 'serviceDiscovery.udpPort',
    },
    {
      title: t('host.discovery.icmp.scan'),
      dataIndex: 'hostDiscovery.enableIcmp',
    },
    {
      title: t('host.discovery.arp.scan'),
      dataIndex: 'hostDiscovery.enableArp',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ];

  // 扫描模板表格数据
  const tableData = reactive<HostScanTemplateRes[]>([]);

  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  const handleAdd = (type: string) => {
    router.push({
      name: 'addTemplate',
    });
  };
  // 当页面加载时，显示数据
  onMounted(async () => {
    cardHeight.value =
      document.documentElement.clientHeight -
      searchRef.value.$el.clientHeight -
      370;
    pagination.value.pageSize = Math.floor(cardHeight.value / 43);
    try {
      const response = await getScanTemplates({
        pageIndex: pagination.value.pageIndex,
        pageSize: pagination.value.pageSize,
      });
      const pageInfo = {
        total: response.totalCount,
        pageIndex: response.pageIndex,
        pageSize: response.pageSize,
      };
      pagination.value = pageInfo;
      response.data.forEach((item) => {
        const enable = t('global.enable');
        const disable = t('global.enable');
        item.hostDiscovery.enableArp =
          item.hostDiscovery.enableArp === '1' ? enable : disable;
        item.hostDiscovery.enableIcmp =
          item.hostDiscovery.enableIcmp === '1' ? enable : disable;
        item.hostDiscovery.enablePu =
          item.hostDiscovery.enablePu === '1' ? enable : disable;
        item.hostDiscovery.enableSyn =
          item.hostDiscovery.enableSyn === '1' ? enable : disable;
        item.performance.portScanSpeed = t(item.performance.portScanSpeed);
      });
      tableData.push(...response.data);
    } catch (error) {
      // todo
    }
  });

  // 行选择器
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });

  // 表格事件触发
  function handleListener(event: string, record: HostScanTemplateRes) {
    // 页面进入时数据的使用pina进行状态管理
    router.push({
      name: 'addTemplate',
      query: {
        type: event,
      },
    });
  }
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
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

  .pagination-style {
    justify-content: end;
  }
</style>
