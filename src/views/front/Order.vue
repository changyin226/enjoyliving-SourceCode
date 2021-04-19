<template>
  <div class="order-page">
    <div v-if="routeName === 'Order'">
      <loading :active.sync="isLoading" color="#00d2ff" :lock-scroll="true"></loading>
      <div v-if="order.id">
        <div class="row justify-content-center mb-5">
          <div class="col-md-8 text-center">
            <table class="table animate__animated"
              v-waypoint="{ active: true, callback: onWaypointList }">
              <thead>
                <th width="25%"></th>
                <th>品名</th>
                <th>數量</th>
                <th>價格</th>
              </thead>
              <tbody>
                <tr v-for="item in order.products" :key="item.id">
                  <td class="align-middle">
                    <img :src="item.product.imgUrl2" alt="商品圖片" class="w-100">
                  </td>
                  <td class="align-middle">
                    <router-link :to="`/product/${item.product.id}`">
                      {{ item.product.title }}
                    </router-link>
                  </td>
                  <td class="align-middle">{{ item.qty }}{{ item.product.unit }}</td>
                  <td class="align-middle text-right">
                    {{  item.final_total | currency }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right">總計</td>
                  <td class="text-right">{{ order.total | currency }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <h2 class="text-center mb-5 animate__animated"
          v-waypoint="{ active: true, callback: onWaypointList }">
          收件人資料
        </h2>
        <div class="row justify-content-center mb-5 animate__animated"
          v-waypoint="{ active: true, callback: onWaypointList }">
          <div class="col-md-8 text-center">
            <table class="table">
              <tbody>
                <tr>
                  <th width="100">訂單編號</th>
                  <td>{{ order.id }}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{{ order.user.email }}</td>
                </tr>
                <tr>
                  <th>姓名</th>
                  <td>{{ order.user.name }}</td>
                </tr>
                <tr>
                  <th>電話</th>
                  <td>{{ order.user.tel }}</td>
                </tr>
                <tr>
                  <th>地址</th>
                  <td>{{ order.user.address }}</td>
                </tr>
                <tr>
                  <th>留言</th>
                  <td>{{ order.message }}</td>
                </tr>
                <tr>
                  <th>付款狀態</th>
                  <td>
                    <span v-if="!order.is_paid">尚未付款</span>
                    <span v-else class="text-success">付款完成</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-right" v-if="!order.is_paid">
              <button type="button" class="btn" @click="payOrder">確認付款去</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <router-view :orderId="orderId"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        user: {},
      },
      orderId: '',
      isLoading: false,
    };
  },
  computed: {
    routeName() {
      return this.$route.name;
    },
  },
  methods: {
    getOrders() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${this.orderId}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.order = response.data.order;
          if (!this.order) {
            this.isLoading = false;
            this.$router.push('/');
            this.$bus.$emit('message:push', '沒有此訂單ID');
          } else {
            this.$emit('change-step', this.order.is_paid);
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
          this.$router.push('/');
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    payOrder() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${this.orderId}`;
      this.$http.post(api).then((response) => {
        if (response.data.success) {
          this.isLoading = false;
          this.$router.push(`/checkout/${this.orderId}/finish`);
          this.$bus.$emit('message:push', response.data.message, 'primary');
        } else {
          this.isLoading = false;
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    onWaypointList({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        const animate = document.querySelectorAll('.animate__animated');
        const arr = Array.from(animate);
        const index = arr.indexOf(el);
        setTimeout(() => {
          el.classList.add('animate__fadeInUp');
        }, index * 300);
      }
    },
  },
  mounted() {
    this.orderId = this.$route.params.order_id;
    this.getOrders();
  },
  beforeRouteUpdate(to, from, next) {
    this.orderId = to.params.order_id;
    this.getOrders();
    next();
  },
};
</script>

<style lang="scss">
.order-page{
  a:hover{
    text-decoration: none;
  }
}
</style>
