<template>
  <div class="navbar-component" :class="{'off-canvas-navbar-component': isOffCanvas}">
    <transition name="transform">
      <ul class="off-canvas p-5" v-show="isOffCanvas">
        <button type="button" class="close-toggle" @click="hideOffCanvas">
          <i class="fa fa-times"></i>
        </button>
        <li>
          <router-link to="/productlist/all/1">產品</router-link>
        </li>
        <li>
          <router-link to="/favorites/1">喜好項目</router-link>
        </li>
        <li>
          <router-link to="/about">關於我們</router-link>
        </li>
        <li>
          <router-link to="/contact">聯絡我們</router-link>
        </li>
        <li>
          <router-link to="/login">後台登入</router-link>
        </li>
        <li>
          <router-link to="/cart">
            <span>
              <small v-if="cartsNum">{{ cartsNum }}</small>
              <i class="fa fa-shopping-cart"></i>
            </span>
          </router-link>
        </li>
      </ul>
    </transition>
    <nav class="nav-bar">
      <div class="container py-4">
        <button type="button" class="nav-toggle" @click.stop="showOffCanvas">
          <i class="fa fa-bars"></i>
        </button>
        <div class="row">
          <div class="col-2">
            <router-link to="/">
              <img src="../../assets/images/Logo.png" alt="公司Logo">
            </router-link>
          </div>
          <div class="col-8 menu">
            <ul class="d-flex justify-content-center align-items-center">
              <li class="mx-3">
                <router-link to="/productlist/all/1">產品</router-link>
              </li>
              <li class="mx-3">
                <router-link to="/about">關於我們</router-link>
              </li>
              <li class="mx-3">
                <router-link to="/contact">聯絡我們</router-link>
              </li>
              <li class="mx-3">
                <router-link to="/login">後台登入</router-link>
              </li>
            </ul>
          </div>
          <div class="col-2 ml-auto cart">
            <router-link to="/favorites/1" title="查看喜好項目">
              <span>
                <i class="fa fa-heart-o mr-3"></i>
              </span>
            </router-link>
            <router-link to="/cart" title="查看購物車">
              <span>
                <small v-if="cartsNum">{{ cartsNum }}</small>
                <i class="fa fa-shopping-cart"></i>
              </span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOffCanvas: false,
      cartsNum: 0,
    };
  },
  methods: {
    getCartsNumber() {
      const cartArray = JSON.parse(localStorage.getItem('cartProducts')) || [];
      this.cartsNum = cartArray.length;
    },
    showOffCanvas() {
      const bodyEl = document.body;
      bodyEl.addEventListener('click', this.bodyElClick, true);
      bodyEl.classList.add('off-canvas-back');
      this.isOffCanvas = true;
    },
    hideOffCanvas() {
      const bodyEl = document.body;
      bodyEl.removeEventListener('click', this.bodyElClick, true);
      bodyEl.classList.remove('off-canvas-back');
      this.isOffCanvas = false;
    },
    bodyElClick(e) {
      e.stopPropagation();
      if (e.target.className !== 'off-canvas p-5' && e.target.nodeName !== 'LI') {
        this.hideOffCanvas();
      }
    },
  },
  mounted() {
    this.$bus.$on('update:cartNum', this.getCartsNumber);
    this.$bus.$on('hideOffCanvas', this.hideOffCanvas);
    this.getCartsNumber();
  },
};
</script>

<style lang="scss">
.navbar-component{
  position: fixed;
  width: 100%;
  height: 66px;
  background: rgba(255, 255, 255, 0.95);
  top: 0;
  z-index: 1;
  transition: 0.3s;
  .transform-enter-active, .transform-leave-active{
    transition: all 0.3s;
  }
  .transform-enter, .transform-leave-to{
    transform: translateX(250px);
  }
  .nav-bar{
    .container{
      position: relative;
    }
    ul{
      margin-bottom: 0;
      list-style: none;
    }
  }
  .off-canvas, .nav-bar{
    img{
      position: absolute;
      top: -14.5px;
    }
    a, span{
      display: inline-block;
      color: #828282;
      font-size: 18px;
      transition: 0.3s;
      &:hover{
        color: #00d2ff;
        text-decoration: none;
        cursor: pointer;
      }
    }
    .nav-toggle{
      color: #828282;
      display: none;
      font-size: 24px;
      background: none;
      border: none;
      padding: 0;
      position: absolute;
      top: 20px;
      right: 15px;
      &:focus{
        outline: none;
      }
    }
    .cart{
      text-align: end;
    }
    span{
      position: relative;
      small{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        font-size: 14px;
        background: #00d2ff;
        color: #fff;
        border-radius: 50%;
        position: absolute;
        top: -12px;
        right: -14px;
      }
    }
  }
  .off-canvas{
    list-style: none;
    width: 250px;
    background: #000;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    margin-bottom: 0;
    a{
      padding: 12px 0;
    }
    span{
      padding: 0;
      font-size: 24px;
      margin-top: 20px;
    }
    .close-toggle{
      color: #828282;
      font-size: 30px;
      background: none;
      border: none;
      position: absolute;
      top: 20px;
      right: 20px;
      &:focus{
        outline: none;
      }
    }
  }
  &.off-canvas-navbar-component{
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
  }
}
@media(max-width: 768px){
  .nav-bar{
    .nav-toggle{
      display: block !important;
    }
    .menu, .cart{
      display: none;
    }
  }
}
</style>
