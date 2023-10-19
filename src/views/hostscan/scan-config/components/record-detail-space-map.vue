<template>
  <!-- 网络空间测绘 -->
  <a-layout>
    <a-card ref="header">
      <a-layout-header style="padding: 10px; background: #f6f8fa">
        <a-row :gutter="24">
          <a-col :span="8">
            <span class="label">{{ t('scan.record.ipv4') }}: </span>
            <span class="value">{{ props.hostDetail.ipv4 }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.ipv6') }}: </span>
            <span class="value">{{ props.hostDetail.ipv6 }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.hostname') }}: </span>
            <span class="value">{{ props.hostDetail.hostname }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <span class="label">{{ t('scan.record.macAddress') }}: </span>
            <span class="value">{{ props.hostDetail.macAddress }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.hostType') }}: </span>
            <span class="value">{{ props.hostDetail.hostType }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.os') }}: </span>
            <span class="value">{{ props.hostDetail.osName }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <span class="label">{{ t('scan.record.domain') }}: </span>
            <span class="value">{{ props.hostDetail.domain }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label"> {{ t('scan.record.fqdn') }}: </span>
            <span class="value">{{ props.hostDetail.fqdn }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.country') }}: </span>
            <span class="value">{{ props.hostDetail.country }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <span class="label">{{ t('scan.record.province') }}: </span>
            <span class="value">{{ props.hostDetail.province }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.city') }}: </span>
            <span class="value">{{ props.hostDetail.city }}</span>
          </a-col>
          <a-col :span="8">
            <span class="label">{{ t('scan.record.region') }}: </span>
            <span class="value">{{ props.hostDetail.region }}</span>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <span class="label">{{ t('scan.record.isp') }}: </span>
            <span class="value">{{ props.hostDetail.isp }}</span>
          </a-col>
        </a-row>
      </a-layout-header>
    </a-card>

    <a-layout style="margin-top: 10px">
      <a-layout-sider :style="{ height: tabsHeight + 105 + 'px' }">
        <a-scrollbar style="height: 280px; overflow: auto">
          <a-space direction="vertical">
            <a-row style="padding: 10px">
              <span>
                <icon-thunderbolt style="color: #165dff" />
                <span>{{ t('scan.record.port.open') }}</span>
              </span>
            </a-row>
            <a-row style="padding: 0px 10px">
              <a-button
                v-for="(item, index) in props.serviceDetail"
                :key="index"
                type="primary"
                style="margin: 5px"
                @click="handleClick(item)"
              >
                {{ item.port }}</a-button
              >
            </a-row>
          </a-space>
        </a-scrollbar>
      </a-layout-sider>
      <a-layout-content :style="{ marginLeft: '10px' }">
        <a-breadcrumb>
          <a-breadcrumb-item :style="{ fontWeight: 'bold' }">
            {{ props.tabDetail.port }}
          </a-breadcrumb-item>
          <a-breadcrumb-item :style="{ fontWeight: 'bold' }">
            {{ props.tabDetail.transportProtocol }}
          </a-breadcrumb-item>
          <a-breadcrumb-item :style="{ fontWeight: 'bold' }">
            {{ props.tabDetail.applicationProtocol }}
          </a-breadcrumb-item>
          <a-breadcrumb-item
            v-if="props.tabDetail.supportSSLVersion"
            :style="{ fontWeight: 'bold' }"
          >
            {{ props.tabDetail.supportSSLVersion }}
          </a-breadcrumb-item>
          <a-breadcrumb-item
            v-if="
              ['HTTP', 'HTTPS'].includes(props.tabDetail.applicationProtocol)
            "
            :style="{ fontWeight: 'bold' }"
          >
            {{ props.tabDetail.httpTitle }}
          </a-breadcrumb-item>
          <a-breadcrumb-item
            v-if="
              ['HTTP', 'HTTPS'].includes(props.tabDetail.applicationProtocol)
            "
            :style="{ fontWeight: 'bold' }"
          >
            {{ props.tabDetail.httpUrl }}
          </a-breadcrumb-item>
          <a-breadcrumb-item :style="{ fontWeight: 'bold' }">
            {{ formatDate(props.tabDetail.updateTime, 'YYYY-MM-DD hh:mm:ss') }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <a-card>
          <a-tabs type="rounded">
            <!-- banner start -->
            <a-tab-pane key="1" :style="{ height: tabsHeight + 'px' }">
              <template #title>
                {{ t('scan.detail.banner') }}
              </template>
              <a-scrollbar style="height: 450px; overflow: auto">
                <a-typography>
                  <a-typography-paragraph
                    v-for="cp in props.tabDetail.components"
                    :key="cp.name"
                    bold
                    class="wrap-text"
                  >
                    {{ cp.name + ' ' + cp.version }}
                  </a-typography-paragraph>
                </a-typography>
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3"> </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>
                    {{ props.tabDetail.banner }}
                  </a-typography-paragraph>
                </a-typography>
              </a-scrollbar>
            </a-tab-pane>
            <!-- SSL start -->
            <a-tab-pane key="2" :style="{ height: tabsHeight + 'px' }">
              <template #title>
                {{ t('scan.detail.ssl') }}
              </template>
              <a-scrollbar style="height: 450px; overflow: auto">
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3"> </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>
                    {{ props.tabDetail.certificate }}
                  </a-typography-paragraph>
                </a-typography>
              </a-scrollbar>
            </a-tab-pane>
            <a-tab-pane key="3" :style="{ height: tabsHeight + 'px' }">
              <template #title>
                {{ t('scan.detail.proof') }}
              </template>
              <a-scrollbar style="height: 450px; overflow: auto">
                <a-typography :style="{ marginTop: '-30px' }">
                  <a-typography-title :heading="3"> </a-typography-title>
                  <a-typography-paragraph bold class="wrap-text" copyable>
                    {{ props.tabDetail.proof }}
                  </a-typography-paragraph>
                </a-typography>
              </a-scrollbar>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, onMounted, defineProps, defineEmits } from 'vue';
  import { useI18n } from 'vue-i18n';
  import formatDate from '@/utils/times';
  // ==========================数据定义==========================
  const { t } = useI18n();

  // 头部实例
  const header = ref();
  // 动态高度
  const tabsHeight = ref();
  // 接收来自父组件的值
  const props: any = defineProps({
    serviceDetail: {
      type: Array,
    },
    tabDetail: {
      type: Object,
    },
    hostDetail: {
      type: Object,
    },
  });

  const emit = defineEmits(['changeTabDetail']);

  // 处理左侧端口开放情况点击事件
  const handleClick = (row: any) => {
    emit('changeTabDetail', row);
  };
  onMounted(() => {
    // 动态计算高度
    const height =
      document.documentElement.clientHeight -
      header.value.$el.offsetHeight -
      320;
    tabsHeight.value = height;
  });
</script>
