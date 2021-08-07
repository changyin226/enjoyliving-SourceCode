<template>
  <div class="cart-page">
    <div class="banner" />
    <div class="container py-5">
      <h2 class="py-5 text-center">
        購物車列表
      </h2>
      <div
        v-if="!loadingSuccess"
        class="blank"
      />
      <div
        v-if="cart.length"
        v-waypoint="{ active: true, callback: onWaypoint }"
        class="row justify-content-center text-center animate__animated"
      >
        <div class="col-md-10">
          <div
            v-for="(item, index) in cart"
            :key="item.id"
            class="cart-list d-flex align-items-center py-3
            border-primary border-bottom border-top"
          >
            <div class="cart-info d-flex align-items-center">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm mr-3 mr-md-5"
                @click="removeCartItem(item.id, index)"
              >
                <i class="fa fa-trash-o" />
              </button>
              <img
                :src="item.product.imgUrl2"
                alt="商品圖片"
                width="25%"
                class="mr-3 mr-md-5"
              >
              <div class="d-md-flex flex-fill align-items-center">
                <h3 class="mb-3 mb-md-0">
                  <router-link :to="`/product/${item.product.id}`">
                    {{ item.product.title }}
                  </router-link>
                </h3>
                <div class="input-group mx-auto">
                  <div class="input-group-prepend">
                    <button
                      type="button"
                      class="btn"
                      :disabled="item.qty === 1"
                      @click="editCartQty(item, index, -1)"
                    >
                      -
                    </button>
                  </div>
                  <input
                    v-model.number="item.qty"
                    type="text"
                    class="form-control text-center"
                  >
                  <div class="input-group-prepend">
                    <button
                      type="button"
                      class="btn"
                      @click="editCartQty(item, index, 1)"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p class="mb-0 font-weight-bold text-right">
              {{ item.product.price * item.qty | currency }}
            </p>
          </div>
          <router-link
            to="/productlist/all/1"
            class="btn btn-lg my-5 mx-1"
          >
            繼續購物
          </router-link>
          <router-link
            to="/checkout"
            class="btn btn-lg my-5 mx-1"
          >
            去買單
          </router-link>
        </div>
      </div>
      <div
        v-if="loadingSuccess && !cart.length"
        v-waypoint="{ active: true, callback: onWaypoint }"
        class="row justify-content-center py-5 animate__animated"
      >
        <div class="col-md-6 text-center border border-primary rounded py-5">
          <p class="notice mb-4">
            目前購物車是空的
            <br>
            快去產品頁逛逛吧
            <br>
          </p>
          <router-link
            to="/productlist/all/1"
            class="btn"
          >
            SHOP
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [],
      loadingSuccess: false,
    };
  },
  mounted() {
    this.postCartList();
    this.$bus.$emit('hideOffCanvas');
  },
  methods: {
    postCartList() {
      this.$bus.$emit('update:loading', true);
      const cacheID = [];
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.$http.get(api)
        .then((response) => {
          const cacheCart = response.data.data.carts;
          cacheCart.forEach((product) => {
            cacheID.push(product.id);
          });
        }).then(() => {
          const vm = this;
          function deleteReq(id) {
            return vm.$http.delete(`${api}/${id}`);
          }
          const promises = cacheID.map((id) => deleteReq(id));
          return Promise.all(promises);
        }).then(async () => {
          const vm = this;
          const cartArray = JSON.parse(localStorage.getItem('cartProducts')) || [];
          function postReq(item) {
            return vm.$http.post(api, { data: item });
          }
          for (let i = 0; i < cartArray.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await postReq(cartArray[i]);
          }
          this.getCartList();
        });
    },
    getCartList() {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.cart = response.data.data.carts;
          this.loadingSuccess = true;
          this.$bus.$emit('update:loading', false);
        } else {
          this.$bus.$emit('update:loading', false);
          this.$router.push('/');
          this.$bus.$emit('message:push', response.data.messages);
        }
      });
    },
    editCartQty(item, index, num) {
      const cartItem = item;
      cartItem.qty += num;
      const cartArray = JSON.parse(localStorage.getItem('cartProducts')) || [];
      cartArray[index].qty = cartItem.qty;
      localStorage.setItem('cartProducts', JSON.stringify(cartArray));
    },
    removeCartItem(id, index) {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          const cartArray = JSON.parse(localStorage.getItem('cartProducts'));
          cartArray.splice(index, 1);
          localStorage.setItem('cartProducts', JSON.stringify(cartArray));
          this.postCartList();
          this.$bus.$emit('update:cartNum');
          this.$bus.$emit('message:push', response.data.message, 'primary');
        } else {
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    onWaypoint({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        el.classList.add('animate__fadeInUp');
      }
    },
  },
};
</script>

<style lang="scss">
.cart-page{
  .banner{
    background: url(../../assets/images/CartBanner.jpg) center;
    background-size: cover;
  }
  h2{
    font-size: 36px;
  }
  .cart-list{
    .input-group{
      width: 120px;
    }
    .cart-info{
      width: calc(100% - 100px);
    }
    a:hover{
      text-decoration: none;
    }
    button.btn{
      border-radius: 0;
    }
    input{
      border: none;
      border-top: 1px solid #00d2ff;
      border-bottom: 1px solid #00d2ff;
    }
    p{
      width: 100px;
    }
  }
}
@media(max-width: 768px){
  .cart-page{
    button.btn:hover{
      color: #00d2ff;
      background: none;
    }
  }
}
</style>
