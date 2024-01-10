<template>
  <h3>{{ $t('workplace.system.params') }}</h3>
  <a-card :header-style="{ paddingBottom: '0' }" :body-style="{ padding: '24px 20px 0 20px' }">
    <a-row :gutter="24">
      <!-- CPU信息 -->
      <a-col :span="8" class="wrapper">
        <span class="title">{{ $t('workplace.system.params.cpu') }}</span>
        <div class="icon">
          <!-- 左侧图标 -->
          <a-avatar :size="40" class="col-avatar" style="background:#f4d135">
            <icon-heart />
          </a-avatar>
          <!-- 右侧进度条 -->
          <div class="precess-wrap">
            <div class="wrapper-item">
              <!-- 数据描述 -->
              <div class="wrapper-header">
                <div class="desc">
                  <div class="circle color1"></div>
                  <span class="text">{{ $t('params.cpu.sys') }}</span>
                </div>
                <!-- <div class="nums">{{ paramsObj.cpu.sys }}</div> -->
              </div>
              <!-- 数据进度条 -->
              <a-progress size="large" color="#f4d135" :percent="operation(paramsObj.cpu.sys, 100, '/')" />
            </div>
            <div class="wrapper-item">
              <!-- 数据描述 -->
              <div class="wrapper-header">
                <div class="desc">
                  <div class="circle color1"></div>
                  <span class="text">{{ $t('params.cpu.used') }}</span>
                </div>
                <!-- <div class="nums">{{ paramsObj.cpu.used }}</div> -->
              </div>
              <!-- 数据进度条 -->
              <a-progress size="large" color="#f4d135" :percent="operation(paramsObj.cpu.used, 100, '/')" />
            </div>
            <div class="wrapper-item">
              <!-- 数据描述 -->
              <div class="wrapper-header">
                <div class="desc">
                  <span class="text">{{ $t('params.cpu.cpuNum') }}</span>
                </div>
                <div class="nums">{{ paramsObj.cpu.cpuNum }}</div>
              </div>
            </div>
            <div class="wrapper-item">
              <div class="wrapper-header">
                <span class="text">{{ $t('params.cpu.cpuModel') }}:{{ paramsObj.cpu.cpuModel }}</span>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-divider style="height:180px" direction="vertical" />
      <!-- 磁盘信息 -->
      <a-col :span="7" class="wrapper">
        <span class="title">{{ $t('workplace.system.params.disk') }}</span>
        <div class="icon">
          <!-- 左侧图标 -->
          <a-avatar :size="40" class="col-avatar" style="background:#88c89e">
            <icon-heart />
          </a-avatar>
          <!-- 右侧进度条 -->
          <div class="precess-wrap">
            <div class="wrapper-item">
              <!-- 数据描述 -->
              <div class="wrapper-header">
                <div class="desc">
                  <div class="circle color2"></div>
                  <span class="text">{{ $t('params.disk.usage') }}</span>
                </div>
                <div class="nums">{{ paramsObj.disk.free }}/{{ paramsObj.disk.total }}</div>
              </div>
              <!-- 数据进度条 -->
              <a-progress size="large" color="#88c89e"
                :percent="operation(props.paramsObj.disk.free, props.paramsObj.disk.total, '/')" :show-text="false" />
            </div>
          </div>
        </div>
      </a-col>
      <a-divider style="height:180px" direction="vertical" />
      <!-- 内存信息 -->
      <a-col :span="8" class="wrapper">
        <span class="title">{{ $t('workplace.system.params.memory') }}</span>
        <div class="icon">
          <!-- 左侧图标 -->
          <a-avatar :size="40" class="col-avatar" style="background:#50a5db">
            <icon-heart />
          </a-avatar>
          <!-- 右侧进度条 -->
          <div class="precess-wrap">
            <div class="wrapper-item">
              <!-- 数据描述 -->
              <div class="wrapper-header">
                <div class="desc">
                  <div class="circle color3"></div>
                  <span class="text">{{ $t('params.memory.usage') }}</span>
                </div>
                <div class="nums">{{ paramsObj.memory.usage * 100 }} %</div>
              </div>
              <!-- 数据进度条 -->
              <a-progress size="large" :show-text="false" color="#50a5db" :percent="paramsObj.memory.usage" />

            </div>
            <div class="wrapper-item">
              <!-- 数据描述 -->
              <div class="wrapper-header">
                <div class="desc">
                  <div class="circle color3"></div>
                  <span class="text">{{ $t('params.memory.used') }}</span>
                </div>
                <div class="nums">{{ paramsObj.memory.used }}GB/{{ paramsObj.memory.total }}GB</div>
              </div>
              <!-- 数据进度条 -->
              <a-progress size="large" color="#50a5db" :show-text="false"
                :percent="operation(paramsObj.memory.used, paramsObj.memory.total, '/')" />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-divider class="split-line" style="margin: 0" />
  </a-card>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';
import { operation } from '@/hooks/opration'


const props = defineProps({
  paramsObj: {
    type: Object
  }
})
</script>

<style scoped lang="less">
.card {
  padding-bottom: 20px;
}

.icon {
  margin: 10px 0;
}

.icon {
  display: flex;
  min-height: 180px;
  align-items: center;

}

.col-avatar {
  margin: 0 10px;
  width: 82px !important;
  height: 60px !important;
}

.precess-wrap {
  width: 100%;
  padding: 0 10px !important;
}

.wrapper-item {
  // display: flex;
  margin: 15px;

  .wrapper-header {
    display: flex;
    margin: 2px 0;

    .desc {
      flex: 1;
      display: flex;
      align-items: center;

      .circle {
        width: 10px;
        height: 10px;
        // border: 1px solid red;
        border-radius: 100%;
        margin-right: 5px;
      }
    }

    .nums {}

  }

}

/deep/ .arco-avatar-image {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.color1 {
  border: 2px solid #f4d135
}

.color2 {
  border: 2px solid #88c89e
}

.color3 {
  border: 2px solid #50a5db
}

.title {
  font-size: 16px;
  font-weight: 700;
}
</style>
