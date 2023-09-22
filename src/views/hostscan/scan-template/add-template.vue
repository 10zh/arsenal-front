<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', tileType]" />
    <a-form :model="formModel" ref='formRef' :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left"
            layout="vertical">
    <a-card class="general-card" :title="t('cardList.list1')" style="margin-bottom: 20px;">
     
      <a-row>
        <a-col :flex="1">
            <a-row style="margin-bottom: 5px" :gutter="24">
              <a-col :span="8">
                <a-form-item field="isLocal" :label="t('form.enableArp')">
                  <a-select v-model="formModel.hostDiscovery.enableArp" :options="enableArpOptions"
                    :placeholder="$t('searchTable.form.selectDefault')" :rules="[
                      { required: true, message: $t('scanengine.add.addressPlaceholder') },
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="enableIcmp" :label="t('form.enableIcmp')">
                  <a-select v-model="formModel.hostDiscovery.enableIcmp" :options="enableArpOptions"
                    :placeholder="$t('searchTable.form.selectDefault')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="enablePu" :label="t('form.enablePu')">
                  <a-select v-model="formModel.hostDiscovery.enablePu" :options="enableArpOptions"
                    :placeholder="$t('searchTable.form.selectDefault')" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-bottom: 5px" :gutter="24">
              <a-col :span="8">
                <a-form-item field="enableSyn" :label="t('form.enableSyn')">
                  <a-select v-model="formModel.hostDiscovery.enableSyn" :options="enableArpOptions"
                    :placeholder="$t('searchTable.form.selectDefault')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="maxRetries" :label="t('form.maxRetries')">
                  <a-input-number v-model="formModel.hostDiscovery.maxRetries"
                    :placeholder="$t('searchTable.form.name.placeholder')" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-bottom: 5px" :gutter="24">
              <a-col :span="8">
                <a-form-item field="puPort" :label="t('form.puPort')">
                  <a-input v-model="formModel.hostDiscovery.synPort"
                    :placeholder="$t('searchTable.form.name.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="synPort" :label="t('form.synPort')">
                  <a-input v-model="formModel.hostDiscovery.synPort"
                    :placeholder="$t('searchTable.form.name.placeholder')" />
                </a-form-item>
              </a-col>
            </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="general-card" :title="t('cardList.list2')" style="margin-bottom: 20px">
      <a-row>
        <a-col :flex="1">
            <a-row style="margin-bottom: 5px" :gutter="24">
              <a-col :span="8">
                <a-form-item field="performance.assetConcurrency" :label="t('form.assetConcurrency')"
                  :rules="[{ required: true, message: $t('scanTemplate.form.errMsg')}]">
                  <a-input-number v-model="formModel.performance.assetConcurrency"
                    />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="performance.singleAssetThread" :label="t('form.singleAssetThread')" 
                 :rules="[{ required: true, message: $t('scanTemplate.form.errMsg') }]"
                 >
                  <a-input-number v-model="formModel.performance.singleAssetThread"
                   />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="performance.portScanSpeed" :label="t('form.portScanSpeed')"
                  :rules="[{ required: true, message: $t('scanTemplate.form.errMsg') }]">
                  <a-select v-model="formModel.performance.portScanSpeed" :options="singleAssetThreadOptions" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row style="margin-bottom: 5px" :gutter="24">
              <a-col :span="8">
                <a-form-item field="tcpPort" :label="t('form.tcpPort')"
                 >
                  <a-input v-model="formModel.serviceDiscovery.tcpPort"
                   />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="udpPort" :label="t('form.udpPort')"
                 >
                  <a-input v-model="formModel.serviceDiscovery.udpPort"
                    :placeholder="$t('searchTable.form.name.placeholder')" />
                </a-form-item>
              </a-col>
            </a-row>
        </a-col>
      </a-row>
    </a-card>
    <a-card class="general-card" :title="t('cardList.list3')">
      <a-row>
        <a-col :flex="1">
          <a-row style="margin-bottom: 5px" :gutter="24">
              <a-col :span="8">
                <a-form-item field="templateName" :label="t('form.templateName')"
                  :rules="[{ required: true, message: $t('scanTemplate.form.errMsg') }]">
                  <a-input v-model="formModel.templateName"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="message" :label="t('form.message')">
                  <a-input v-model="formModel.message" />
                </a-form-item>
              </a-col>
            </a-row>
        </a-col>
      </a-row>
      <div style="text-align: center">
        <a-button type="outline" style="margin: 0 10px;" @click="handleReset">
          <template #icon>
            <icon-refresh />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>重置</template>
        </a-button>
        <a-button type="primary" @click="handleSubmit" style="margin: 0 10px;" v-show="pageType != 'detail'">
          <template #icon>
            <icon-send />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>提交</template>
        </a-button>
        <a-button  @click="handleBack" style="margin: 0 10px;">
          <template #icon>
            <icon-left-circle />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>返回</template>
        </a-button>
      </div>
    </a-card>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted} from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { useI18n } from 'vue-i18n';
import { HostScanTemplateRes , addScanTemplates, editScanTemplates} from '@/api/scan/scan-template'
import { HttpResponse } from '@/api/interceptor/axios';
import { Message } from '@arco-design/web-vue';
import { useRouter,useRoute } from 'vue-router';
import {useTemplateStore} from '@/store'

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const pageType = ref<string>('');
const useTemplate = useTemplateStore();
const formData = {
  id:'',
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
};
const formModel = reactive<HostScanTemplateRes>({...formData})
const formRef = ref();
// 判断是编辑还是新增还是查看
const tileType = computed<string>(() => {
  let str = '';
  // 若返回值不是 string 类型则会报错
  if(pageType.value === 'edit'){
    str = 'menu.list.edittemplate'
  }else if(pageType.value === 'detail'){
    str = 'menu.list.showtemplate'
  }else{
     str = 'menu.list.addtemplate'
  }
  return str
})
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
// 提交
const handleSubmit = () => {
  formRef.value.validate().then(async (res: any) => {
    if(!res){
      // 提交
     try {
      if(pageType.value === 'edit'){
        const data : HttpResponse | any = await editScanTemplates(formModel);
       if (data.success) {
              Message.success('修改成功');
              router.go(-1);
            } else {
              Message.error(data.errMessage);
        }

      }else{
        const data : HttpResponse | any = await addScanTemplates(formModel);
       if (data.success) {
              Message.success('提交成功');
              router.go(-1);
            } else {
              Message.error(data.errMessage);
              
        }

      }
      
     } catch(error) {
      console.log(error)

     }
    }
  })

}
// 返回上一个页面
const handleBack = ()=>{
  router.go(-1);
}
// 重置默认
const handleReset = ()=>{
 Object.assign(formModel,formData)
}
onMounted(()=>{
  if(route.query){
    // 数据回显
   formModel.performance = useTemplate.performance ;
   formModel.templateName = useTemplate.templateName;
   formModel.serviceDiscovery = useTemplate.serviceDiscovery;
   formModel.hostDiscovery = useTemplate.hostDiscovery;
   formModel.id = useTemplate.id;
   pageType.value = route.query.type
  }
  
})

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
