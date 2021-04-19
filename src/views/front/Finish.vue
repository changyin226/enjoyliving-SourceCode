<template>
  <div class="finish-page animate__animated"
    v-waypoint="{ active: true, callback: onWaypoint }">
    <div class="container">
      <div class="row justify-content-center mb-5"
        v-waypoint="{ active: true, callback: onWaypoint }">
        <div class="col-md-6 text-center border border-primary rounded py-5">
          <p class="notice mb-0">
            恭喜完成訂單！
          </p>
        </div>
      </div>
      <div class="row justify-content-center text-center">
        <div class="col-md-4">
          <router-link :to="`/checkout/${orderId}`" class="btn d-block mb-3">查看訂單</router-link>
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
    orderId: {
      type: String,
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
};
</script>
