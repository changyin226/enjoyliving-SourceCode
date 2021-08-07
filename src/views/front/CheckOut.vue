<template>
  <div class="checkout-page">
    <div class="banner mb-5" />
    <div class="container py-5">
      <div class="row justify-content-center text-center mb-5">
        <div class="col-md-10">
          <div class="row order-step">
            <div class="col">
              <span
                class="rounded-pill py-2 px-3"
                :class="{active : activeStep === 1}"
              >
                STEP 1
              </span>
              <p>確認資料</p>
            </div>
            <div class="col">
              <span
                class="rounded-pill py-2 px-3"
                :class="{active : activeStep === 2}"
              >
                STEP 2
              </span>
              <p>確認付款</p>
            </div>
            <div class="col">
              <span
                class="border border-primary rounded-pill py-2 px-3"
                :class="{active : activeStep === 3}"
              >
                STEP 3
              </span>
              <p>完成訂單</p>
            </div>
          </div>
        </div>
      </div>
      <router-view @change-step="changeStep($event)" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeStep: 0,
    };
  },
  mounted() {
    this.$bus.$emit('hideOffCanvas');
  },
  methods: {
    changeStep(step) {
      if (typeof (step) === 'boolean') {
        this.activeStep = step ? 3 : 2;
      } else {
        this.activeStep = step;
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.activeStep = 0;
    this.$bus.$emit('hideOffCanvas');
    next();
  },
};
</script>

<style lang="scss">
.checkout-page{
  .banner{
    background: url(../../assets/images/CheckOutBanner.jpg) center;
    background-size: cover;
  }
  .order-step{
    position: relative;
    span{
      display: inline-block;
      color: #00d2ff;
      font-weight: bold;
      border: 1px solid #00d2ff;
      background: #fff;
      &.active{
        color: #fff;
        background: #00d2ff;
      }
    }
    &::after{
      content: "";
      position: absolute;
      top: 23%;
      left: 20%;
      width: 60%;
      z-index: -1;
      border-top: 1px solid;
      color: #00d2ff;
    }
  }
  .form-group{
    label{
      margin-bottom: 10px;
    }
  }
}
</style>
