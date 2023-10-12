<template>
    <div class="container">
        <Breadcrumb :items="['menu.hostscan', 'menu.hostscan.editScanTemplate']" />
        <a-form :model="formModel" ref="formRef" style="height:100%" auto-label-width>
            <a-card class="general-card" :title="$t('menu.hostscan.editScanTemplate')">
                <div class="content-container">
                    <!-- 左侧主机发现start -->
                    <div class="right-container">
                        <div class="header-tags">
                            <span style="background:#33cc99">{{ t('hostscan.addTemplate.hostDiscovery.nav') }}</span>
                        </div>
                        <!-- 主机发现表单start -->
                        <a-form-item field="templateName" :label="t('form.templateName.label')" :rules="[
                            { required: true, message: $t('form.templateName.validate') },
                        ]">
                            <a-input v-model="formModel.templateName" :placeholder="t('form.templateName.placeHolder')" />
                        </a-form-item>
                        <a-form-item field="enableArp" :label="t('form.enableArp.label')">
                            <a-select v-model="formModel.hostDiscovery.enableArp" :options="enableOptions" />
                        </a-form-item>
                        <a-form-item field="enableIcmp" :label="t('form.enableIcmp.label')">
                            <a-select v-model="formModel.hostDiscovery.enableIcmp" :options="enableOptions" />
                        </a-form-item>
                        <a-form-item field="enableSyn" :label="t('form.enableSyn.label')">
                            <a-select v-model="formModel.hostDiscovery.enableSyn" :options="enableOptions" />
                        </a-form-item>
                        <a-form-item field="enablePu" :label="t('form.enablePu.label')">
                            <a-select v-model="formModel.hostDiscovery.enablePu" :options="enableOptions" />
                        </a-form-item>
                        <a-form-item field="puPort" :label="t('form.synPort.label')">
                            <a-input v-model="formModel.hostDiscovery.synPort"
                                :placeholder="$t('form.synPort.placeHolder')" />
                        </a-form-item>
                        <a-form-item field="synPort" :label="t('form.puPort.label')">
                            <a-input v-model="formModel.hostDiscovery.puPort"
                                :placeholder="$t('form.puPort.placeHolder')" />
                        </a-form-item>
                        <a-form-item field="maxRetries" :label="t('form.maxRetries.label')">
                            <a-input-number v-model="formModel.hostDiscovery.maxRetries"
                                :placeholder="$t('form.maxRetries.placeHolder')" :min="1" :max="3" />
                        </a-form-item>
                        <!-- 主机发现表单end -->
                    </div>
                    <a-divider direction="vertical">
                    </a-divider>
                    <!-- 中间性能参数start -->
                    <div class="center-container">
                        <div class="header-tags">
                            <span style="background:#0099cc">{{ t('hostscan.addTemplate.performParams.nav') }}</span>
                        </div>
                        <!-- 性能参数表单start -->
                        <a-form-item field="performance.assetConcurrency" :label="t('form.assetConcurrency.label')" :rules="[
                            { required: true, message: $t('form.assetConcurrency.validate') },
                        ]">
                            <a-input-number v-model="formModel.performance.assetConcurrency" />
                        </a-form-item>
                        <a-form-item field="performance.singleAssetThread" :label="t('form.singleAssetThread.label')"
                            :rules="[
                                { required: true, message: $t('form.singleAssetThread.validate') },
                            ]">
                            <a-input-number v-model="formModel.performance.singleAssetThread" />
                        </a-form-item>
                        <a-form-item field="performance.portScanSpeed" :label="t('form.portScanSpeed.label')" :rules="[
                            { required: true, message: $t('form.portScanSpeed.validate') },
                        ]">
                            <a-select v-model="formModel.performance.portScanSpeed" :options="singleAssetThreadOptions" />
                        </a-form-item>
                        <!-- 性能参数表单end -->

                    </div>
                    <a-divider direction="vertical">

                    </a-divider>
                    <!-- 右侧服务发现start -->
                    <div class="right-container">
                        <div class="header-tags">
                            <span style="background:#0066cc">{{ t('hostscan.addTemplate.serviceDiscovery.nav') }}</span>
                        </div>
                        <!-- 服务发现表单start -->
                        <a-form-item field="serviceDiscovery.survivalMode" :label="t('form.survivalMode.label')">
                            <a-select v-model="formModel.serviceDiscovery.tcpDetectType"
                                :placeholder="t('form.survivalMode.placeHolder')" :options="survivalOptions" />
                        </a-form-item>
                        <a-form-item field="serviceDiscovery.tcpPort" :label="t('form.tcpPort.label')">
                            <a-input v-model="formModel.serviceDiscovery.tcpPort"
                                :placeholder="$t('form.tcpPort.placeHolder')" />
                        </a-form-item>
                        <a-form-item field="serviceDiscovery.udpPort" :label="t('form.udpPort.label')">
                            <a-input v-model="formModel.serviceDiscovery.udpPort"
                                :placeholder="$t('form.udpPort.placeHolder')" />
                        </a-form-item>
                        <!-- 服务发现表单end -->
                    </div>
                </div>
                <!-- 按钮 -->
                <div style="text-align: center">
                    <a-button type="outline" style="margin: 0 10px" @click="handleReset">
                        <template #icon>
                            <icon-refresh />
                        </template>
                        <template #default>{{ t('scan.add.template.reset') }}</template>
                    </a-button>
                    <a-button type="primary" style="margin: 0 10px" @click="handleSubmit">
                        <template #icon>
                            <icon-send />
                        </template>
                        <template #default>{{ t('scan.add.template.submit') }}</template>
                    </a-button>
                    <a-button style="margin: 0 10px" @click="handleBack">
                        <template #icon>
                            <icon-left-circle />
                        </template>
                        <template #default>{{ t('scan.add.template.back') }}</template>
                    </a-button>
                </div>

            </a-card>
        </a-form>
    </div>
</template>
  
<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted } from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { useI18n } from 'vue-i18n';
import {
    HostScanTemplateRes,
    editScanTemplates,
    getSingleScanTemplates,
} from '@/api/scan/scan-template';
import { HttpResponse } from '@/api/interceptor/axios';
import { Message } from '@arco-design/web-vue';
import { useRouter, useRoute } from 'vue-router';


const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// 表单数据初始化
const formData = {
    id: '',
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
        assetConcurrency: 100,
        singleAssetThread: 10,
        portScanSpeed: 'T3',
    },
    serviceDiscovery: {
        tcpPort: '1-1024',
        udpPort: '53,5353',
        tcpDetectType: '半连接',
    },
    templateName: '',
    message: '',
};
const formModel = reactive<HostScanTemplateRes>({ ...formData });
const formRef = ref();

// 表单下拉框选项定义
// 是否开启下拉框
const enableOptions = computed<SelectOptionData[]>(() => [
    {
        label: t('form.enable.true'),
        value: '1',
    },
    {
        label: t('form.enable.false'),
        value: '0',
    },
]);
// 扫描速度下拉框
const singleAssetThreadOptions = computed<SelectOptionData[]>(() => [
    {
        label: t('scan.template.port.scan.t1'),
        value: 'T1',
    },
    {
        label: t('scan.template.port.scan.t2'),
        value: 'T2',
    },
    {
        label: t('scan.template.port.scan.t3'),
        value: 'T3',
    },
    {
        label: t('scan.template.port.scan.t4'),
        value: 'T4',
    },
    {
        label: t('scan.template.port.scan.t5'),
        value: 'T5',
    },
]);
// 验证存活方式下拉框
const survivalOptions = computed<SelectOptionData[]>(() => [
    {
        label: t('form.survival.all'),
        value: 'TCP_CONNECT,',
    },
    {
        label: t('form.survival.single'),
        value: 'SYN',
    }
])
// ===================初始化数据(回显)===========
const initTemplateData = async () => {
    const data: HttpResponse | any = await getSingleScanTemplates(route.query.templateId);
    if (data.success) {
        Object.assign(formModel, data.data);
    } else {
        Message.error(data.errMessage);
    };
};
// ===================事件=======================
// 提交
const handleSubmit = () => {
    formRef.value.validate().then(async (res: any) => {
        if (!res) {
            try {
                const data: HttpResponse | any = await editScanTemplates(formModel);
                if (data.success) {
                    Message.success(t('scan.edit.template.success'));
                    router.go(-1);
                } else {
                    Message.error(data.errMessage);
                };
            } catch (error) {
                console.log(error);
            }
        }
    });
};
// 返回上一个页面
const handleBack = () => {
    router.go(-1);
};
// 重置默认
const handleReset = () => {
    Object.assign(formModel, formData);
};
// 当页面加载时回显数据
onMounted(() => {
    initTemplateData()
});
</script>
  
<style scoped lang="less">
.container {
    padding: 0 20px 20px 20px;
    height: calc(100vh - 150px);
}

.general-card {
    height: 100%;

    /deep/ .arco-card-header-title {
        // font-weight: 700;
        font-size: 18px;
    }

    /deep/ .arco-card-body {
        height: calc(100% - 150px);
    }

    .content-container {
        height: 100%;
        display: flex;
        justify-content: space-evenly;

    }


    .right-container,
    .center-container,
    .right-container {
        // height: 800px;
        // background: #ccc;
        flex: 1;
        padding-right: 10px;


        .header-tags {
            text-align: center;
            margin-bottom: 40px;

            >span {
                display: inline-block;
                color: #fff;
                padding: 10px;
                border: 1px solid #fafafa;
                border-radius: 10px;
                font-size: 18px;
            }




        }

    }

    .center-container {
        // margin: 0 20px;
    }
}
</style>
  