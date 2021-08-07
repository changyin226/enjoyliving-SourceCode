<template>
  <div class="orders-page">
    <table
      v-if="orders.length"
      class="table mt-5"
    >
      <thead>
        <tr class="text-white text-center">
          <th class="d-none d-sm-table-cell">
            購買日期
          </th>
          <th>訂單編號</th>
          <th class="d-none d-sm-table-cell">
            應付金額
          </th>
          <th>是否付款</th>
          <th>更多資訊</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="order in sortOrder"
          :key="order.id"
          class="text-white text-center"
          :class="{'text-danger': !order.is_paid}"
        >
          <td class="d-none d-sm-table-cell align-middle">
            {{ order.create_at | timestamp }}
          </td>
          <td class="align-middle">
            {{ order.id }}
          </td>
          <td class="d-none d-sm-table-cell align-middle text-right">
            {{ order.total | currency }}
          </td>
          <td class="align-middle">
            <strong
              v-if="order.is_paid"
              class="text-secondary"
            >已付款</strong>
            <span
              v-else
              class="text-danger"
            >尚未付款</span>
          </td>
          <td>
            <button
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="openModal(order)"
            >
              更多
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="loadingSuccess && !orders.length"
      class="text-center border border-primary rounded mt-5 py-5"
    >
      <p class="notice mb-0 py-5">
        沒有訂單
      </p>
    </div>
    <Pagination
      v-if="orders.length"
      class="my-5"
      :pagination="pagination"
    />
    <OrderModal :order="tempOrder" />
  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/back/Pagination.vue';
import OrderModal from '@/components/back/OrderModal.vue';

export default {
  components: {
    Pagination,
    OrderModal,
  },
  data() {
    return {
      orders: [],
      tempOrder: {
        user: {},
      },
      pagination: {},
      currentPage: 1,
      loadingSuccess: false,
    };
  },
  computed: {
    sortOrder() {
      const vm = this;
      let newOrder = [];
      if (vm.orders.length) {
        newOrder = vm.orders.sort((a, b) => {
          const aIsPaid = a.is_paid ? 1 : 0;
          const bIsPaid = b.is_paid ? 1 : 0;
          return bIsPaid - aIsPaid;
        });
      }
      return newOrder;
    },
  },
  mounted() {
    this.currentPage = this.$route.params.page;
    this.getOrders(this.currentPage);
    this.$bus.$emit('update:routerActive');
  },
  methods: {
    getOrders(page = 1) {
      this.$bus.$emit('update:loading', true);
      this.loadingSuccess = false;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/orders?page=${page}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.orders = response.data.orders;
          this.pagination = response.data.pagination;
          this.loadingSuccess = true;
          this.$bus.$emit('update:loading', false);
        } else {
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    openModal(order) {
      this.tempOrder = order;
      $('#orderModal').modal('show');
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = to.params.page;
    this.getOrders(this.currentPage);
    $('#orderModal').modal('hide');
    next();
  },
  beforeRouteLeave(to, from, next) {
    $('#orderModal').modal('hide');
    next();
  },
};
</script>
