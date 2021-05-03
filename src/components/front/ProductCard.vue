<template>
  <div class="product-card-component">
    <div class="product-img" :style="{backgroundImage:`url('${product.imgUrl}')`}"
      @click="goToProduct">
        <div class="product-img-inner">
          <div>
            <a href="#" class="icon" title="加到購物車"
              @click.prevent.stop="addToCart">
                <i class="fa fa-shopping-cart"></i>
            </a>
            <a href="#" class="icon" title="觀看產品"
              @click.prevent.stop="goToProduct">
                <i class="fa fa-eye"></i>
            </a>
          </div>
        </div>
    </div>
    <div class="desc">
      <h3 class="mb-1">
          {{ product.title }}
      </h3>
      <span class="price">{{ product.price | currency }}</span>
    </div>
    <div class="discount" v-if="discount">
      <span>{{ discount }}折</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  computed: {
    discount() {
      if (this.product.price !== this.product.origin_price) {
        const num = Math.round((this.product.price / this.product.origin_price) * 100);
        if (num % 10) return num;
        return num / 10;
      }
      return 0;
    },
  },
  methods: {
    goToProduct() {
      this.$router.push(`/product/${this.product.id}`);
    },
    addToCart() {
      this.$emit('change-isLoading', true);
      const cartArray = JSON.parse(localStorage.getItem('cartProducts')) || [];
      const cacheId = cartArray.map((product) => product.product_id);
      if (cacheId.includes(this.product.id)) {
        let cart = {};
        cartArray.forEach((product, index) => {
          if (product.product_id === this.product.id) {
            let { qty } = product;
            cart = {
              product_id: this.product.id,
              qty: qty += 1,
            };
            cartArray.splice(index, 1);
          }
        });
        cartArray.push(cart);
      } else {
        const cart = {
          product_id: this.product.id,
          qty: 1,
        };
        cartArray.push(cart);
      }
      localStorage.setItem('cartProducts', JSON.stringify(cartArray));
      this.$bus.$emit('update:cartNum');
      this.$bus.$emit('message:push', '已加入購物車', 'primary');
      setTimeout(() => {
        this.$emit('change-isLoading', false);
      }, 500);
    },
  },
};
</script>

<style lang="scss">
.product-card-component{
  text-align: center;
  margin-bottom: 40px;
  .product-img{
    background-position: center;
    background-size: cover;
    height: 350px;
    margin-bottom: 20px;
    transition: 0.3s;
    &:hover{
      cursor: pointer;
      box-shadow: 0px 10px 24px -7px rgba(0, 0, 0, 0.35);
      .product-img-inner{
        opacity: 1;
      }
      & + .desc h3{
        color: #00d2ff;
      }
    }
  }
  .product-img-inner{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    opacity: 0;
    background: rgba(0, 0, 0, 0.3);
    transition: 0.3s;
    .icon{
      display: inline-block;
      margin: 0 3px;
      padding: 14px;
      color: #fff;
      background: rgba(0, 205, 172, 0.8);
      transition: 0.3s;
      &:hover{
        color: #00d2ff;
        background: rgba(255, 250, 255, 0.8);
      }
    }
  }
  .desc{
    h3{
      font-size: 14px;
      line-height: 24px;
      transition: 0.3s;
    }
    .price{
      color: #828282;
      letter-spacing: 1px;
    }
  }
  .discount{
    position: absolute;
    top: 19px;
    right: -28px;
    width: 150px;
    height: 0;
    border-width: 0 24px 26px;
    border-style: solid;
    border-color: transparent transparent rgb(240, 60, 60);
    transform: rotate(-315deg);
    span{
      display: block;
      font-size: 17px;
      line-height: 26px;
      font-weight: bold;
      text-align: center;
      color: #fff;
    }
    &::before, &::after{
      content: '';
      position: absolute;
      top: 14px;
      border-width: 12px;
      border-style: solid;
      transform: rotate(315deg);
    }
    &::before{
      left: -36px;
      border-color: transparent transparent rgb(160, 60, 60);
    }
    &::after{
      right: -36px;
      border-color: transparent transparent transparent rgb(160, 60, 60);
    }
  }
}
@media(max-width: 768px){
  .product-card-component{
    margin-bottom: 70px;
    .product-img-inner{
      display: none;
    }
  }
}
</style>
