<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <!-- <div class="login-form-sub-title">VULNERABILITY SCANNING MANAGEMENT SYSTEM</div> -->
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="captcha"
        :rules="[{ required: true, message: $t('login.form.captcha.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
      <a-input
          v-model="userInfo.captcha"
          :placeholder="$t('login.form.captcha.placeholder')"
        >
        </a-input>
       
        <div class="captcha-wrap" @click="getCaptcha">
          <img :src="captchaImg" style="width:100%;height: 100%;" />
        </div>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import {getCaptchaImg} from '@/api/user'
  import { onMounted } from 'vue';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginConfig = useStorage('login-config', {
    rememberPassword: true,
    username: 'admin', // 演示默认值
    password: 'admin@123', // demo default value
    captcha:'',
    captchaKey:''
  });
  const userInfo = reactive({
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    captcha: loginConfig.value.captcha,
    captchaKey: loginConfig.value.captchaKey,
  });
  const captchaImg = ref<string>('');
 // 获取验证码
 async function getCaptcha(){
    const data  = await getCaptchaImg();
    captchaImg.value = data.data.image;
    userInfo.captchaKey = data.data.key;

  }


  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.login(values as LoginData);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        getCaptcha()
        setLoading(false);
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };
  onMounted(()=>{
    getCaptcha()
  })
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 380px;
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
      padding: 30px 20px;
      text-align: center;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 700;
      font-size: 30px;
      letter-spacing: 12px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 12px;
      line-height: 28px;
      margin-top: 5px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
  .captcha {
    &-wrap{
      width : 100px; 
      border : 1px solid #ccc;
      border-radius: 0 2px 2px 0;
      height: 30px;
    }
  }
</style>
