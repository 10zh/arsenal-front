import type { RouteLocationNormalized } from 'vue-router';
import { defineStore } from 'pinia';
import {HostScanTemplateRes} from '@/api/scan/scan-template'
import { stringify } from 'query-string/base';

// 模板数据进行回显
const useTemplateStore = defineStore('template', {
    state: (): HostScanTemplateRes => ({
        id:'',
        hostDiscovery: {
            enableArp: '',
            enableIcmp: '',
            enablePu: '',
            enableSyn: '',
            maxRetries: 0,
            puPort: '',
            synPort: '',
          },
          performance: {
            assetConcurrency: 0,
            singleAssetThread: 0,
            portScanSpeed: '',
            
          },
          serviceDiscovery: {
            tcpPort: '',
            udpPort: '',
          },
          templateName: '',
          message: '',
      }),
    actions: {
         // Set user's information
      setTemplateInfo(info : HostScanTemplateRes) {
         this.hostDiscovery = info.hostDiscovery;
         this.performance = info.performance;
         this.serviceDiscovery = info.serviceDiscovery;
         this.templateName = info.templateName;
         this.id = info.id;
      },
    }

})
export default useTemplateStore;