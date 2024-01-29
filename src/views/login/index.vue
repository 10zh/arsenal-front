<template>
  <div class="container">
    <!-- <div class="logo">
      <img alt="logo"
        src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image" />
      <div class="logo-text">Arco Design Pro</div>
    </div>
    <LoginBanner /> -->
    <div class="content">
      <div class="content-inner">
        <LoginForm />
        <a-divider direction="vertical" />
        <div class="img-container">
          <div class="img-item">
            <div class="img-bg">
              <img src="../../assets/images/logo.png">
            </div>
            <span style="font-size:20px;color:#165dff;font-weight:700">Arsenal</span>

          </div>
          <div class="img">
          </div>
        </div>
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Footer from '@/components/footer/index.vue';
import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;
  // background: url('../../assets/images/login-bg.jpg') no-repeat;
  background-size: cover;
  background-position: 100%;
  background-color: #f3f3f3;

  .banner {
    width: 550px;
    background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  }

  .content {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;

    .content-inner {
      display: flex;
      background: #fff;
      min-height: 400px;
      // box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }

    .img-container {
      width: 400px;
      position: relative;

      .img-item {
        position: absolute;
        right: 20px;
        top: 20px;
        display: flex;
        align-items: center;
      }
    }

    .img {
      width: 100%;
      height: 100%;
      // height: 200px;
      background: url("@/assets/images/login.png");
    }
  }

  .img-bg {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: #f3f3f3;
    padding: 8px;

    img {
      width: 100%;
      height: 100%;
      vertical-align: middle
    }
  }

}

.footer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
}

.logo {
  position: fixed;
  top: 24px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;

  &-text {
    margin-right: 4px;
    margin-left: 4px;
    color: var(--color-fill-1);
    font-size: 20px;
  }
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>
