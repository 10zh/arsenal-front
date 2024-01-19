<template>
  <div class="card-content">
    <a-card class="general-card" v-for="item in cardData" :key="item.id">
      <a-button type="text" class="edit-btn" @click="handleEdit(item.id)">{{ t('manage.user.edit') }}</a-button>
      <div style="margin:0 0 20px 0">
        <div class="card-header">
          <span style="color:#333;font-weight:bold">{{ item.username }}</span>

          <a-tag color="green" v-if="item.status === 0 || item.status === null" style="margin:0 20px">
            <template #icon>
              <icon-check-circle-fill />
            </template>
            {{ t('user.status.on') }}
          </a-tag>
          <a-tag color="red" v-else style="margin:0 20px">
            <template #icon>
              <icon-check-circle-fill />
            </template>
            {{ t('user.status.off') }}
          </a-tag>
        </div>

        <div style="margin-top: 10px;font-size:12px">{{ formatDate(item.createTime, 'YYYY-MM-DD') }}</div>
      </div>
      <a-space direction="vertical" size="medium">
        <div><span>{{ t('manage.user.email') }}：</span>
          <span class="desc">{{ item.email || '-' }}</span>

        </div>
        <div><span>{{ t('manage.user.tel') }}：</span>
          <span class="desc">
            {{ item.phone || '-' }}</span>
        </div>
      </a-space>
      <div class="btn">
        <a-popconfirm :content="t('manage.user.delete.question')" @ok="handleDelete(item.id)">
          <a-button style="margin-right:10px">{{ t('manage.user.delete') }}</a-button>
        </a-popconfirm>
        <a-popconfirm v-if="item.status === 1" :content="t('manage.user.set1.question')" @ok="handleUse(item)">
          <a-button type="primary" status="warning" style="margin-left:10px">{{ t('manage.user.use') }}</a-button>
        </a-popconfirm>
        <a-popconfirm v-else :content="t('manage.user.set.question')" @ok="handleNoUse(item)">
          <a-button type="primary" style="margin-left:10px">{{ t('manage.user.nouse') }}</a-button>
        </a-popconfirm>


      </div>
    </a-card>
    <!-- 编辑用户 -->
    <editDialog ref="editUserRef"></editDialog>

  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted, defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';
import formatDate from '@/utils/times'
import { deleteUser, setUser, setNoUser } from '@/api/manage/user'
import { Message } from '@arco-design/web-vue';
import editDialog from './edit-dialog.vue'



const { t } = useI18n();
// 编辑对话框实例
const editUserRef = ref()
// 父组件传递的卡片数据
const props = defineProps({
  cardData: {
    type: Array,
    default: () => { },
  },
});
// 子组件调用父组件获取列表
const emits = defineEmits(['initData'])


// 编辑
const handleEdit = (id) => {
  editUserRef.value.handleEditVisible(true, id);
}
// 删除
const handleDelete = async (id) => {

  const res = await deleteUser(id);
  if (res.success) {
    Message.success(t('user.response.delete'));
    emits('initData')
  } else {
    Message.error(res.errMessage);
  }

}
// 启用
const handleUse = async (item) => {
  const res = await setUser(item.id);
  if (res.success) {
    Message.success(t('user.response.set'));
    emits('initData')
  } else {
    Message.error(res.errMessage);
  }
}
// 禁用
const handleNoUse = async (item) => {
  const res = await setNoUser(item.id);
  if (res.success) {
    Message.success(t('user.response.set'));
    emits('initData')
  } else {
    Message.error(res.errMessage);
  }
}

</script>
<style scoped lang="less">
.card-content {
  width: 100%;
  // display: flex;
  display: flex;
  flex-wrap: wrap;

}

.general-card {
  border: 1px solid #ccc;
  width: 300px;
  padding: 10px 5px;
  position: relative;

  margin: 20px;
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

}

.btn {
  margin-top: 20px;
  width: 100%;
  text-align: right
}
</style>