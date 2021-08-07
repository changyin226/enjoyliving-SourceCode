<template>
  <div class="check-order-page">
    <div
      v-if="!loadingSuccess"
      class="blank"
    />
    <div v-if="cart.carts && cart.carts.length">
      <div
        v-waypoint="{ active: true, callback: onWaypointList }"
        class="row justify-content-center mb-5 animate__animated"
      >
        <div class="col-md-8 text-center">
          <table class="table mb-4">
            <thead>
              <th width="20%" />
              <th>品名</th>
              <th>數量</th>
              <th>價格</th>
            </thead>
            <tbody>
              <tr
                v-for="item in cart.carts"
                :key="item.id"
              >
                <td class="align-middle">
                  <img
                    :src="item.product.imgUrl2"
                    alt="商品圖片"
                    class="w-100"
                  >
                </td>
                <td class="align-middle">
                  <router-link :to="`/product/${item.product.id}`">
                    {{ item.product.title }}
                  </router-link>
                  <span
                    v-if="item.coupon"
                    class="d-block text-secondary mt-1"
                  >
                    已套用優惠券
                  </span>
                </td>
                <td class="align-middle">
                  {{ item.qty }}{{ item.product.unit }}
                </td>
                <td
                  v-if="!item.coupon"
                  class="align-middle text-right"
                >
                  {{ item.product.price * item.qty | currency }}
                </td>
                <td
                  v-else
                  class="align-middle text-right"
                >
                  <del>{{ item.product.price * item.qty | currency }}</del>
                  <span class="d-block text-secondary mt-1">
                    {{ item.final_total | currency }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td
                  colspan="3"
                  class="text-right"
                >
                  總計
                </td>
                <td class="text-right">
                  {{ cart.total | currency }}
                </td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td
                  colspan="3"
                  class="text-right text-secondary"
                >
                  折扣價
                </td>
                <td class="text-right text-secondary">
                  {{ cart.final_total | currency }}
                </td>
              </tr>
            </tfoot>
          </table>
          <div class="input-group">
            <input
              v-model="couponCode"
              type="text"
              class="form-control"
              name="優惠碼"
              placeholder="請輸入優惠碼"
              @keyup.enter="addCouponCode"
            >
            <div class="input-group-append">
              <button
                type="button"
                class="btn"
                @click="addCouponCode"
              >
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>
      <h2
        v-waypoint="{ active: true, callback: onWaypointList }"
        class="text-center py-5 animate__animated"
      >
        收件人資料
      </h2>
      <ValidationObserver v-slot="{ invalid }">
        <div
          v-waypoint="{ active: true, callback: onWaypointList }"
          class="row justify-content-center animate__animated"
        >
          <form
            class="col-md-8"
            @submit.prevent
          >
            <ValidationProvider
              v-slot="{ errors, classes }"
              rules="required|email"
            >
              <div class="form-group">
                <label for="email">
                  Email
                  <span class="badge badge-danger">必填*</span>
                </label>
                <input
                  id="email"
                  v-model="form.user.email"
                  type="email"
                  name="信箱"
                  class="form-control"
                  :class="classes"
                  placeholder="請輸入 Email"
                >
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, classes }"
              rules="required"
            >
              <div class="form-group">
                <label for="username">
                  姓名
                  <span class="badge badge-danger">必填*</span>
                </label>
                <input
                  id="username"
                  v-model="form.user.name"
                  type="text"
                  name="姓名"
                  class="form-control"
                  :class="classes"
                  placeholder="請輸入姓名"
                >
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, classes }"
              rules="required"
            >
              <div class="form-group">
                <label for="usertel">
                  電話
                  <span class="badge badge-danger">必填*</span>
                </label>
                <input
                  id="usertel"
                  v-model="form.user.tel"
                  type="tel"
                  name="電話"
                  class="form-control"
                  :class="classes"
                  placeholder="請輸入電話"
                >
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <ValidationProvider
              v-slot="{ errors, classes }"
              rules="required"
            >
              <div class="form-group">
                <label for="useraddress">
                  地址
                  <span class="badge badge-danger">必填*</span>
                </label>
                <input
                  id="useraddress"
                  v-model="form.user.address"
                  type="text"
                  name="地址"
                  class="form-control"
                  :class="classes"
                  placeholder="請輸入地址"
                >
                <span class="invalid-feedback">{{ errors[0] }}</span>
              </div>
            </ValidationProvider>
            <div class="form-group">
              <label for="message">留言</label>
              <textarea
                id="message"
                v-model="form.message"
                name="message"
                class="form-control"
                cols="30"
                rows="10"
              />
            </div>
            <div class="text-right mb-5">
              <button
                type="submit"
                class="btn"
                :disabled="invalid"
                data-toggle="modal"
                data-target="#comfirmModal"
              >
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </ValidationObserver>
    </div>
    <div
      v-if="loadingSuccess && !cart.carts"
      v-waypoint="{ active: true, callback: onWaypointList }"
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
    <comfirmModal @create-order="createOrder" />
  </div>
</template>

<script>
import comfirmModal from '@/components/front/comfirmModal.vue';
import $ from 'jquery';

export default {
  components: {
    comfirmModal,
  },
  data() {
    return {
      cart: [],
      couponCode: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      loadingSuccess: false,
    };
  },
  mounted() {
    this.postCartList();
    this.$emit('change-step', 1);
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
          if (cartArray.length) {
            for (let i = 0; i < cartArray.length; i += 1) {
              // eslint-disable-next-line no-await-in-loop
              await postReq(cartArray[i]);
            }
            this.getCartList();
          } else {
            this.loadingSuccess = true;
            this.$bus.$emit('update:loading', false);
          }
        });
    },
    getCartList() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.cart = response.data.data;
          this.loadingSuccess = true;
          this.$bus.$emit('update:loading', false);
        } else {
          this.$bus.$emit('update:loading', false);
          this.$router.push('/cart');
          this.$bus.$emit('message:push', response.data.messages);
        }
      });
    },
    addCouponCode() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
      const code = {
        code: this.couponCode,
      };
      this.$http.post(api, { data: code }).then((response) => {
        if (response.data.success) {
          this.getCartList();
          this.$bus.$emit('message:push', response.data.message, 'primary');
        } else {
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
      this.couponCode = '';
    },
    createOrder() {
      $('#comfirmModal').modal('hide');
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order`;
      this.$http.post(api, { data: this.form }).then((response) => {
        if (response.data.success) {
          this.$router.push(`checkout/${response.data.orderId}`);
          localStorage.removeItem('cartProducts');
          this.$bus.$emit('update:cartNum');
          this.$bus.$emit('message:push', response.data.message, 'primary');
        } else {
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    onWaypointList({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        const animate = document.querySelectorAll('animate__animated');
        const arr = Array.from(animate);
        const index = arr.indexOf(el);
        setTimeout(() => {
          el.classList.add('animate__fadeInUp');
        }, index * 300);
      }
    },
  },
};
</script>

<style lang="scss">
.check-order-page{
  a:hover{
    text-decoration: none;
  }
  form{
    .form-control {
      font-size: 18px;
      border: 2px solid;
      border-image: linear-gradient(135deg, #00d2ff 0%, #00cdac 100%);
      border-image-slice: 1;
    }
    .invalid-feedback{
      display: block;
      visibility: hidden;
      height: 12px;
    }
    .is-invalid ~ .invalid-feedback{
      visibility: visible;
    }
  }
}
@media(max-width: 768px){
  .check-order-page{
    button.btn{
      &:hover{
        color: #00d2ff;
        background: none;
      }
    }
  }
}
</style>
