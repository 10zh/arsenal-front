<template>
    <div class="container">
        <Breadcrumb :items="['menu.hostscan', 'menu.list.addtemplate']" />
        <a-card class="general-card" :title="t('cardList.list1')" style="margin-bottom:20px">
            <a-row>
                <a-col :flex="1">
                    <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
                        label-align="left" layout="vertical">
                        <a-row style="margin-bottom: 5px;" :gutter="24">
                            <a-col :span="8">
                                <a-form-item field="isLocal" :label="t('form.enableArp')">
                                    <a-select v-model="formModel.enableArp" :options="enableArpOptions"
                                        :placeholder="$t('searchTable.form.selectDefault')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="enableIcmp" :label="t('form.enableIcmp')">
                                    <a-select v-model="formModel.enableIcmp" :options="enableArpOptions"
                                        :placeholder="$t('searchTable.form.selectDefault')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="enablePu" :label="t('form.enablePu')">
                                    <a-select v-model="formModel.enablePu" :options="enableArpOptions"
                                        :placeholder="$t('searchTable.form.selectDefault')" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row style="margin-bottom: 5px;" :gutter="24">
                            <a-col :span="8">
                                <a-form-item field="enableSyn" :label="t('form.enableSyn')">
                                    <a-select v-model="formModel.enableSyn" :options="enableArpOptions"
                                        :placeholder="$t('searchTable.form.selectDefault')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="maxRetries" :label="t('form.maxRetries')">
                                    <a-input v-model="formModel.maxRetries"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />
                                </a-form-item>
                            </a-col>

                        </a-row>
                        <a-row style="margin-bottom: 5px;" :gutter="24">
                            <a-col :span="8">
                                <a-form-item field="puPort" :label="t('form.puPort')">
                                    <a-input v-model="formModel.synPort"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="synPort" :label="t('form.synPort')">
                                    <a-input v-model="formModel.synPort"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />

                                </a-form-item>
                            </a-col>

                        </a-row>

                    </a-form>
                </a-col>
            </a-row>
        </a-card>
        <a-card class="general-card" :title="t('cardList.list2')" style="margin-bottom:20px">
            <a-row>
                <a-col :flex="1">
                    <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
                        label-align="left" layout="vertical">
                        <a-row style="margin-bottom: 5px;" :gutter="24">
                            <a-col :span="8">
                                <a-form-item field="assetConcurrency" :label="t('form.assetConcurrency')">
                                    <a-input v-model="formModel.assetConcurrency"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="singleAssetThread " :label="t('form.singleAssetThread')">
                                    <a-input v-model="formModel.singleAssetThread"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="portScanSpeed" :label="t('form.portScanSpeed')">
                                    <a-select v-model="formModel.portScanSpeed" :options="singleAssetThreadOptions"
                                        :placeholder="$t('searchTable.form.selectDefault')" />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row style="margin-bottom: 5px;" :gutter="24">
                            <a-col :span="8">
                                <a-form-item field="tcpPort" :label="t('form.tcpPort')">
                                    <a-input v-model="formModel.tcpPort"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />
                                </a-form-item>
                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="udpPort" :label="t('form.udpPort')">
                                    <a-input v-model="formModel.udpPort"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />
                                </a-form-item>
                            </a-col>

                        </a-row>


                    </a-form>
                </a-col>
            </a-row>
        </a-card>
        <a-card class="general-card" :title="t('cardList.list3')">
            <a-row>
                <a-col :flex="1">
                    <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
                        label-align="left" layout="vertical">
                        <a-row style="margin-bottom: 5px;" :gutter="24">
                            <a-col :span="8">
                                <a-form-item field="templateName" :label="t('form.templateName')">
                                    <a-input v-model="formModel.templateName"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />

                                </a-form-item>

                            </a-col>
                            <a-col :span="8">
                                <a-form-item field="message" :label="t('form.message')">
                                    <a-input v-model="formModel.message"
                                        :placeholder="$t('searchTable.form.name.placeholder')" />

                                </a-form-item>

                            </a-col>

                        </a-row>

                    </a-form>
                </a-col>
            </a-row>
            <div style="text-align:center">
            <a-button type="primary" style="margin:0 20px;">
                <template #icon>
                    <icon-refresh />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>重置</template>
            </a-button>
            <a-button type="primary" style="margin:0 20px;">
                <template #icon>
                    <icon-send />
                </template>
                <!-- Use the default slot to avoid extra spaces -->
                <template #default>提交</template>
            </a-button>
        </div>
        </a-card>
        

    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
interface formData {
    enableArp: string,
    enableIcmp: string,
    enablePu: string,
    enableSyn: string,
    maxRetries: number,
    puPort: string,
    synPort: string,
    assetConcurrency: number,
    portScanSpeed: string,
    singleAssetThread: number,
    tcpPort: string,
    udpPort: string,
    templateName: string,
    message: string
}
const formModel = reactive<formData>({
    enableArp: '1',
    enableIcmp: '0',
    enablePu: '1',
    enableSyn: '1',
    maxRetries: 2,
    puPort: '53,5353',
    synPort: '1-1024',
    assetConcurrency: 0,
    portScanSpeed: 'T3',
    singleAssetThread: 5,
    tcpPort: '1-1024',
    udpPort: '53,5353',
    templateName: '',
    message: '',
})
const enableArpOptions = computed<SelectOptionData[]>(() => [
    {
        label: t('form.contentType.enableArp.true'),
        value: '1',
    },
    {
        label: t('form.contentType.enableArp.false'),
        value: '0',
    }
]);
const singleAssetThreadOptions = computed<SelectOptionData[]>(() => [
    {
        label: t('form.contentType.portScanSpeed.T1'),
        value: 'T1',
    },
    {
        label: t('form.contentType.portScanSpeed.T2'),
        value: 'T2',
    }, {
        label: t('form.contentType.portScanSpeed.T3'),
        value: 'T3',
    }, {
        label: t('form.contentType.portScanSpeed.T4'),
        value: 'T4',
    }, {
        label: t('form.contentType.portScanSpeed.T5'),
        value: 'T5',
    },
]);


</script>
<style scoped lang="less">
.container {
    padding: 0 20px 20px 20px;
}
</style>