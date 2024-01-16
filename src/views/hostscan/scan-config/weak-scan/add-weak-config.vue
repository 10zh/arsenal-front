<template>
  <div class="container">
    <Breadcrumb :items="[
      'menu.hostscan',
      'menu.hostscan.config',
      id ? 'menu.weak.hostscan.config.edit' : 'menu.weak.hostscan.config.add',
    ]" />
    <a-card class="general-card" type="rounded">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
      </div>
      <a-tabs default-active-key="1" size="large" :active-key="activeKey" @change="handleTabs">
        <!-- 扫描配置start -->
        <a-tab-pane key="1">
          <template #title><icon-calendar /> {{ t('host.scan.config.basic.info') }}
          </template>
          <a-alert type="warning">提示：提交之前请确认已填写扫描计划信息</a-alert>
          <a-form ref="formRef" :model="form" :style="{ width: '700px', marginLeft: '15px', marginTop: '15px' }"
            auto-label-width label-align="left" size="large" @submit="handleSubmit">
            <a-form-item field="configName" :tooltip="t('host.scan.config.configName.input')"
              :label="t('host.scan.config.configName')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.configName.input'),
                },
              ]">
              <a-input v-model="form.configName" :placeholder="t('host.scan.config.configName.input')" />
            </a-form-item>
            <a-form-item field="target" :tooltip="t('host.scan.config.target.tooltip')"
              :label="t('host.scan.config.target')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.target.tooltip'),
                },
              ]">
              <a-input v-model="form.target" :placeholder="t('host.scan.config.target.input')" />
            </a-form-item>
            <a-form-item field="excludeTarget" :tooltip="t('host.scan.config.excludeTarget.tooltip')"
              :label="t('host.scan.config.excludeTarget')">
              <a-input v-model="form.excludeTarget" :placeholder="t('host.scan.config.excludeTarget.input')" />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" size="small" html-type="submit">
                  <template #icon>
                    <icon-send />
                  </template>
                  <template #default>{{ t('golbal.submit') }}</template>
                </a-button>
                <a-button type="outline" size="small" @click="handleReset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  <template #default>{{ t('golbal.reset') }}</template>
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <!-- 扫描配置end -->
        <!-- 扫描引擎start -->
        <a-tab-pane key="2">
          <template #title>
            <icon-user /> {{ t('host.scan.config.engine') }}
          </template>
          <SelectEngineTable @receive-select="receiveSelectEngineRowKey" />
        </a-tab-pane>
        <!-- 扫描引擎end -->
        <!-- 扫描弱口令模板start -->
        <a-tab-pane key="3">
          <template #title>
            <icon-clock-circle /> {{ t('host.scan.config.weak.template') }}</template>
          <SelectTemplateTable @receive-select="receiveSelectTemplateRowKey" />
        </a-tab-pane>
        <!-- 扫描计划 start-->
        <a-tab-pane key="4">
          <template #title>
            <icon-storage /> {{ t('host.scan.config.scanPlan') }}</template>
          <a-form ref="formRef" :model="form" :style="{ width: '700px', marginLeft: '15px' }" auto-label-width
            label-align="left" size="large" @submit="handleSubmit">
            <a-form-item field="scanPlan.enable" :tooltip="t('host.scan.config.enable')"
              :label="t('host.scan.config.enable')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.enable'),
                },
              ]">
              <a-select v-model="form.scanPlan.enable" :options="enableOptions"
                :placeholder="t('host.scan.config.enable')" />
            </a-form-item>
            <a-form-item field="scanPlan.timezone" :tooltip="t('host.scan.config.timezone')"
              :label="t('host.scan.config.timezone')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.timezone'),
                },
              ]">
              <a-select v-model="form.scanPlan.timezone" :placeholder="t('host.scan.config.timezone')"
                :options="timeZoneOptions" />
            </a-form-item>
            <a-form-item field="scanPlan.startTime" :tooltip="t('host.scan.config.startTime')"
              :label="t('host.scan.config.startTime')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.startTime'),
                },
              ]">
              <a-date-picker format="YYYY-MM-DD HH:mm:ss" show-time style="width:100%" v-model="form.scanPlan.startTime"
                :disabledDate="disabledDate" :placeholder="t('host.scan.config.startTime')" />
            </a-form-item>
            <a-form-item field="scanPlan.scanType" :tooltip="t('host.scan.config.scanType')"
              :label="t('host.scan.config.scanType')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.scanType'),
                },
              ]">
              <a-select v-model="form.scanPlan.scanType" :placeholder="t('host.scan.config.scanType')"
                :options="scanTypeOptions" />
            </a-form-item>
            <a-form-item field="scanPlan.maxContinueTime" :tooltip="t('host.scan.config.maxContinueTime')"
              :label="t('host.scan.config.maxContinueTime')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.maxContinueTime'),
                },
              ]">
              <a-input v-model="form.scanPlan.maxContinueTime" :placeholder="t('host.scan.config.maxContinueTime')"
                allow-clear>
                <template #append>
                  h
                </template>
              </a-input>
            </a-form-item>
            <a-form-item field="scanPlan.planType" :tooltip="t('host.scan.config.planType')"
              :label="t('host.scan.config.planType')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.planType'),
                },
              ]">
              <a-select v-model="form.scanPlan.planType" :placeholder="t('host.scan.config.planType')"
                :options="planTypeOptions" />
            </a-form-item>
            <a-form-item field="scanPlan.continueTimeStatus" :tooltip="t('host.scan.config.continueTimeStatus')" :rules="[
              {
                required: true,
                message: t('host.scan.config.continueTimeStatus'),
              },
            ]" :label="t('host.scan.config.continueTimeStatus')">
              <a-select v-model="form.scanPlan.continueTimeStatus"
                :options="form.scanPlan.planType === 1 ? continueTimeStatusOptionsOne : continueTimeStatusOptionsTwo"
                :placeholder="t('host.scan.config.continueTimeStatus')" />
            </a-form-item>
            <a-form-item v-if="form.scanPlan.planType === 1" field="scanPlan.continueTime"
              :tooltip="t('host.scan.config.continueTime')" :label="t('host.scan.config.continueTime')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.continueTime'),
                },
              ]">
              <a-input v-model="form.scanPlan.continueTime" :placeholder="t('host.scan.config.continueTime')" allow-clear>
                <template #append>
                  h
                </template>
              </a-input>
            </a-form-item>

          </a-form>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================


import { Message } from '@arco-design/web-vue';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { insertWeakHostScanConfig, getWeakHostScanConfig, editWeakHostScanConfig } from '@/api/scan/scan-config';
import { useRoute, useRouter } from 'vue-router';
import SelectEngineTable from './components/select-engine.vue';
import SelectTemplateTable from './components/select-template.vue';

const router = useRouter();
const route = useRoute();

const { t } = useI18n();

// ===========================数据模块===========================
const form = reactive({
  configName: '',
  target: '',
  excludeTarget: '',
  engineId: '',
  templateId: '',
  scanPlan: {
    continueTime: '',
    continueTimeStatus: null,
    enable: false,
    maxContinueTime: '',
    planType: 1,
    scanType: 1,
    startTime: '',
    timezone: 'Asia/Shanghai',

  }
});
// 表单实例
const formRef = ref();
// 激活的tab栏key
const activeKey = ref('1');
// 当编辑时，路由参数存在id
const id = route.query.id || '';
// ===========================数据定义===========================
// 选择时间不能选择当日之前的时间
const disabledDate = (date) => {
  return Date.now() >= new Date(date).getTime()

}

// 是否开启扫描计划的select选项
const enableOptions = [{
  label: t('host.scan.scanPlan.enable.true'),
  value: true,
}, {
  label: t('host.scan.scanPlan.enable.false'),
  value: false,
}]
// 周期性任务时：到达最长持续时间后的状态select框
const continueTimeStatusOptionsTwo = [{
  label: t('host.scan.scanPlan.continue.stop'),
  value: 1,
}, {
  label: t('host.scan.scanPlan.continue.pause'),
  value: 2,
}]
// 一次性任务时：到达最长持续时间后的状态select框
const continueTimeStatusOptionsOne = [{
  label: t('host.scan.scanPlan.continue.stop.next'),
  value: 3,
}, {
  label: t('host.scan.scanPlan.continue.pause.next'),
  value: 4,
}]
// 扫描计划select框
const planTypeOptions = [{
  label: t('host.scan.scanPlan.planType.one'),
  value: 1,
}, {
  label: t('host.scan.scanPlan.planType.two'),
  value: 2,
}]
// 扫描类型select框
const scanTypeOptions = [{
  label: t('host.scan.scanPlan.scanType.two'),
  value: 1,
}]
// 时区select框
const timeZoneOptions = [{
  label: 'Asia/Shanghai',
  value: 'Asia/Shanghai',
}, {
  label: 'UTC',
  value: 'UTC',
}, {
  label: 'GMT',
  value: 'GMT',
}]
// ===========================事件响应===========================
// 表单提交事件
const handleSubmit = async (data: any) => {
  if (data.errors) {
    console.log('errors ', data.errors);
    return;
  }
  if (id) {
    // 编辑接口
    const res = await editWeakHostScanConfig(id, data.values);
    if (!res.success) {
      return;
    }
    Message.success(t('host.scan.config.edit.success'));
    router.push({
      name: 'scanConfig',
    });
  } else {
    // 新增接口
    const response: any = await insertWeakHostScanConfig(data.values);
    // 调用新增扫描配置接口
    if (!response.success) {
      return;
    }
    Message.success(t('host.scan.config.add.success'));
    router.push({
      name: 'scanConfig',
    });
  }


};

// ==========================事件响应模块==========================
// 收到引擎组件选择key
const receiveSelectEngineRowKey = (key: any) => {
  form.engineId = key.value;
};
// 收到模板组件选择key
const receiveSelectTemplateRowKey = (key: any) => {

  form.templateId = key.value;
};
// 返回
const goBack = () => {
  router.go(-1);
};
// 重置
const handleReset = () => {
  formRef.value.resetFields();
};
// 切换tabs获取key
const handleTabs = (key: any) => {
  activeKey.value = key;
};
// 表单回显
const initData = async () => {
  const res = await getWeakHostScanConfig(id);
  Object.assign(form, res.data);
  console.log(form)
}
// 初始化数据
onMounted(() => {
  // 如果路由存在参数说明是编辑页面
  if (id) {
    initData()
  }
})
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

s .header-title {
  padding: 20px 0;
  font-weight: 700;
  display: inline-block;
}

.back-btn {
  text-align: right;
  padding-top: 20px;
  position: absolute;
  top: -12px;
  right: 20px;
  z-index: 99;
}
</style>
