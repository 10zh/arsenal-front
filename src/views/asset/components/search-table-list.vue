<template>
  <div style="width:100%">
    <div class="general-card">
      <div class="card-left">
        <a-typography>
          <a-typography-paragraph copyable>
            <span style="color:#333;font-size:20px">192.168.31.1</span>
          </a-typography-paragraph>
          <a-typography-paragraph>
            <a-tag color="green">445/SMB</a-tag>
          </a-typography-paragraph>
          <a-typography-paragraph>
            中国，长沙市，芙蓉区
          </a-typography-paragraph>
          <a-typography-paragraph>
            中国，长沙市，芙蓉区
          </a-typography-paragraph>
          <a-typography-paragraph>
            中国，长沙市，芙蓉区
          </a-typography-paragraph>
          <a-typography-paragraph>
            中国，长沙市，芙蓉区
          </a-typography-paragraph>
          <a-typography-paragraph>
            中国，长沙市，芙蓉区
          </a-typography-paragraph>
        </a-typography>
      </div>
      <div class="card-center">
        <a-tabs type="rounded">

          <a-tab-pane key="1" :title="$t('asset.list.banner')">
            <a-typography style="padding-left: 10px;">
              <a-typography-paragraph copyable>
                192.168.31.1
              </a-typography-paragraph>
            </a-typography>
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('asset.list.certify')">
            <a-typography>
              <a-typography-paragraph copyable>
                192.168.31.1
              </a-typography-paragraph>
            </a-typography>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="card-right">


      </div>
    </div>
    <a-pagination class="pagination" :total="page.total" :current="page.pageIndex" :page-size="page.pageSize" show-total
      show-jumper show-page-size @change="changePageEvent" @page-size-change="changeSizeEvent" />
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { addScanEngine } from '@/api/scan/scan-engine';
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();

const page = reactive({
  pageSize: 10,
  pageIndex: 1,
  total: 10
})

// ==========================事件响应==========================
// 分页
const changeSizeEvent = () => {

}
const changePageEvent = () => {

}

</script>
<style scoped lang="less">
.general-card {


  position: relative;
  margin: 10px 20px;
  display: flex;


  .card-left {
    padding: 10px 5px;

    border: 1px solid var(--color-neutral-3);
    flex: 1;
  }

  .card-center {
    padding: 10px 0px;
    border-top: 1px solid var(--color-neutral-3);
    border-bottom: 1px solid var(--color-neutral-3);
    border-right: 1px solid var(--color-neutral-3);
    flex: 2;

  }

  .card-right {
    flex: 1;
    margin-left: 20px;
    border: 1px solid red;
  }
}

/deep/ .arco-tabs-nav {
  border-bottom: 1px solid var(--color-neutral-3);
  padding-bottom: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  widows: 100%;
}
</style>