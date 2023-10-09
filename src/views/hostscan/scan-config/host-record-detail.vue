<template>
  <div class="container">
    <Breadcrumb
      :items="[
        'menu.hostscan',
        'menu.hostscan.config',
        'menu.hostscan.config.record.host.detail',
      ]"
    />
    <a-card>
      <a-row :gutter="24">
        <a-col :span="11">
          <a-card class="left-card">
            <a-row>
              <span>
                <icon-cloud />
                {{ t('scan.record.host.basic.info') }}
              </span>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.ipv4') }}</a-col>
              <a-col :span="12">{{ hostDetail.ipv4 }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.ipv6') }}</a-col>
              <a-col :span="12">{{ hostDetail.ipv6 }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.hostname') }}</a-col>
              <a-col :span="12">{{ hostDetail.hostname }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.macAddress') }}</a-col>
              <a-col :span="12">{{ hostDetail.macAddress }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.hostType') }}</a-col>
              <a-col :span="12">{{ hostDetail.hostType }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.os') }}</a-col>
              <a-col :span="12">{{ hostDetail.osName }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.fqdn') }}</a-col>
              <a-col :span="12">{{ hostDetail.fqdn }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.domain') }}</a-col>
              <a-col :span="12">{{ hostDetail.domain }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.country') }}</a-col>
              <a-col :span="12">{{ hostDetail.country }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.province') }}</a-col>
              <a-col :span="12">{{ hostDetail.province }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.city') }}</a-col>
              <a-col :span="12">{{ hostDetail.city }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.region') }}</a-col>
              <a-col :span="12">{{ hostDetail.region }}</a-col>
            </a-row>
            <a-divider />
            <a-row :gutter="24">
              <a-col :span="12">{{ t('scan.record.isp') }}</a-col>
              <a-col :span="12">{{ hostDetail.isp }}</a-col>
            </a-row>
          </a-card>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="12">
          <a-card class="right-card" hoverable>
            <a-row>
              <span>
                <icon-thunderbolt />
                <span>{{ t('scan.record.port.open') }}</span>
              </span>
            </a-row>
            <a-divider />
            <a-row>
              <a-anchor
                v-for="item in serviceDetail"
                :key="item.port"
                line-less
              >
                <a-anchor-link :href="'#' + item.port">
                  <a-button type="primary" long> {{ item.port }} </a-button>
                </a-anchor-link>
              </a-anchor>
            </a-row>
          </a-card>
          <div v-for="item in serviceDetail" :key="item.port">
            <a-row :style="{ marginTop: '20px' }" :gutter="24">
              <a-col :span="16">
                <a-breadcrumb>
                  <a-breadcrumb-item>{{ item.port }}</a-breadcrumb-item>
                  <a-breadcrumb-item>{{
                    item.transportProtocol
                  }}</a-breadcrumb-item>
                  <a-breadcrumb-item>{{ item.accuracy }}</a-breadcrumb-item>
                  <a-breadcrumb-item
                    v-if="
                      item.applicationProtocol === 'HTTP' ||
                      item.applicationProtocol === 'HTTPS'
                    "
                  >
                    <a-tooltip
                      :content="item.httpUrl"
                      background-color="#3491FA"
                    >
                      <a-link :href="item.httpUrl"><icon-link /></a-link>
                    </a-tooltip>
                  </a-breadcrumb-item>
                  <a-breadcrumb-item
                    v-if="
                      item.applicationProtocol === 'HTTP' ||
                      item.applicationProtocol === 'HTTPS'
                    "
                  >
                    <a-tooltip
                      :content="item.httpTitle"
                      background-color="#3491FA"
                    >
                      <span class="ellip-text">{{
                        'title:' + item.httpTitle
                      }}</span>
                    </a-tooltip>
                  </a-breadcrumb-item>
                  <a-breadcrumb-item />
                </a-breadcrumb>
              </a-col>
              <a-col :span="8">
                {{ formatDate(item.updateTime) }}
              </a-col>
            </a-row>
            <a-card :id="item.port">
              <a-row>
                <a-col
                  v-for="component in item.components"
                  :key="component.name"
                  :style="{ marginTop: '-30px' }"
                  flex="auto"
                  :span="4"
                >
                  <a-typography-title :heading="3">{{
                    component.name + ' ' + component.version
                  }}</a-typography-title>
                </a-col>
              </a-row>
              <a-row
                v-if="
                  item.applicationProtocol === 'HTTP' ||
                  item.applicationProtocol === 'HTTPS'
                "
                ><a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3">
                    {{ t('scan.record.service.header') }}
                  </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>{{
                    item.httpHeader
                  }}</a-typography-paragraph>
                </a-typography></a-row
              >
              <a-row
                v-if="
                  item.applicationProtocol !== 'HTTP' &&
                  item.applicationProtocol !== 'HTTPS'
                "
              >
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3">
                    {{ t('scan.record.service.banner') }}
                  </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>{{
                    item.banner
                  }}</a-typography-paragraph>
                </a-typography>
              </a-row>
              <a-row v-if="item.unMatchBanner !== ''">
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3">
                    {{ t('scan.record.service.unmatch.banner') }}
                  </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>{{
                    item.unMatchBanner
                  }}</a-typography-paragraph>
                </a-typography>
              </a-row>
              <a-row v-if="item.certificate !== ''">
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3">
                    {{ t('scan.record.service.ssl.certificate') }}
                  </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>{{
                    item.certificate
                  }}</a-typography-paragraph>
                </a-typography>
              </a-row>
              <a-row v-if="item.proof !== ''">
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3">
                    {{ t('scan.record.service.proof') }}
                  </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text">{{
                    item.proof
                  }}</a-typography-paragraph>
                </a-typography>
              </a-row>
            </a-card>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script setup>
  // ==========================声明模块==========================
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import {
    getHostRecordDetailByScanHostId,
    getHostServiceRecordDetailByScanHostId,
  } from '@/api/scan/scan-record';
  import formatDate from '@/utils/times';

  // ==========================数据定义模块==========================
  const { t } = useI18n();
  const route = useRoute();

  // 扫描配置ID
  const { scanId, hostId } = route.query;

  // 主机详情数据
  const hostDetail = ref({});

  // 服务详情数据
  const serviceDetail = ref([]);

  // ==========================数据操纵模块==========================
  // 初始化主机详情
  const initHostScanRecordDetail = async () => {
    const response = await getHostRecordDetailByScanHostId(scanId, hostId);
    hostDetail.value = response.data;
  };
  // 初始化服务详情
  const initHostScanServiceRecordDetail = async () => {
    const response = await getHostServiceRecordDetailByScanHostId(
      scanId,
      hostId
    );
    serviceDetail.value = response.data;
  };
  // 当页面加载时，显示数据
  onMounted(() => {
    initHostScanRecordDetail();
    initHostScanServiceRecordDetail();
  });
</script>

<style lang="less">
  .left-card {
    border-top: 2px solid #f2a20e;
  }

  .right-card {
    border-top: 2px solid #41a4db;
  }

  .arco-anchor-link-item .arco-anchor-link {
    padding: 0px;
    width: 50px;
  }

  .arco-anchor {
    width: auto;
    margin-right: 20px;
  }

  .wrap-text {
    position: relative;
    white-space: pre-wrap;
  }

  .arco-typography-operation-copy {
    position: absolute;
    right: 0px;
    top: -2px;
  }

  .arco-typography-operation-copied {
    position: absolute;
    right: 0px;
    top: -2px;
  }

  .ellip-text {
    white-space: nowrap;
    cursor: pointer;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100px;
  }
</style>
