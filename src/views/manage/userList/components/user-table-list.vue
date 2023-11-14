<template>
  <div style="width:100%">
    <a-card class="general-card">
      <a-button type="text" class="edit-btn">{{ t('manage.user.edit') }}</a-button>
      <div style="margin:0 0 20px 0">
        <div class="card-header">
          <span style="color:#333;font-weight:bold">userA</span>

          <a-tag color="green" style="margin:0 20px">
            <template #icon>
              <icon-check-circle-fill />
            </template>
            已启用
          </a-tag>
        </div>

        <div style="margin-top: 10px;font-size:12px">2021-1201-1</div>
      </div>
      <a-space direction="vertical" size="medium">
        <div><span>{{ t('manage.user.email') }}：</span>
          <span class="desc">2021-1201-1</span>

        </div>
        <div><span>{{ t('manage.user.tel') }}：</span>
          <span class="desc">
            2021-1201-1</span>
        </div>
      </a-space>
      <div class="btn">
        <a-button style="margin-right:10px">{{ t('manage.user.delete') }}</a-button>
        <a-button type="primary">{{ t('manage.user.nouse') }}</a-button>
      </div>
    </a-card>
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
  border: 1px solid #ccc;
  width: 300px;
  padding: 10px 5px;
  position: relative;
}

.card-header {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

/deep/ .arco-card-body {
  padding: 0 15px;
}

.desc {
  display: inline-block;
  margin-left: 10px;
}

.edit-btn {
  position: absolute;
  right: 5px;
  top: 3px;

}

.btn {
  margin-top: 20px;
  width: 100%;
  text-align: right
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  widows: 100%;
}
</style>