<template>
  <div class="finish-page animate__animated"
    v-waypoint="{ active: true, callback: onWaypoint }">
    <div class="container">
      <div class="row justify-content-center mb-5"
        v-waypoint="{ active: true, callback: onWaypoint }">
        <div class="col-md-8 text-center border border-primary rounded py-5">
          <p class="notice mb-5">
            恭喜完成訂單！
          </p>
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
        </div>
      </div>
      <div class="row justify-content-center text-center">
        <div class="col-md-4">
          <router-link :to="`/checkout/${order.id}`" class="btn d-block mb-3">查看訂單細節</router-link>
          <router-link to="/productlist/all/1" class="btn d-block mb-3">繼續購物</router-link>
          <router-link to="/" class="btn d-block mb-5">回首頁</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onWaypoint({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        el.classList.add('animate__fadeInUp');
      }
    },
  },
  mounted() {
    document.body.classList.remove('vld-shown');
  },
};
</script>
