<template>
  <div class="coupons-page">
    <div class="text-right">
      <button
        type="button"
        class="btn btn-primary mt-4 text-white"
        @click="openModal(true)"
      >
        建立新的優惠卷
      </button>
    </div>
    <table
      v-if="coupons.length"
      class="table mt-4"
    >
      <thead>
        <tr class="text-white text-center">
          <th>名稱</th>
          <th>折扣</th>
          <th>到期日</th>
          <th class="d-none d-sm-table-cell">
            是否啟用
          </th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="coupon in coupons"
          :key="coupon.id"
          class="text-white text-center"
        >
          <td class="align-middle">
            {{ coupon.title }}
          </td>
          <td class="align-middle">
            {{ coupon.percent }}%
          </td>
          <td class="align-middle">
            {{ coupon.due_date | timestamp }}
          </td>
          <td class="align-middle d-none d-sm-table-cell">
            <span
              v-if="coupon.is_enabled"
              class="text-success"
            >啟用</span>
            <span
              v-else
              class="text-danger"
            >未啟用</span>
          </td>
          <td class="align-middle">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm mx-auto mx-sm-1"
              @click="openModal(false, coupon)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm mx-auto mx-sm-1"
              @click="deleteModal(coupon)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="loadingSuccess && !coupons.length"
      class="text-center border border-primary rounded mt-5 py-5 mx-auto"
    >
      <p class="notice mb-0 py-5">
        沒有已建立的優惠卷
      </p>
    </div>
    <Pagination
      v-if="coupons.length"
      :pagination="pagination"
      class="my-5"
    />
    <CouponModal
      :modal-title="modalTitle"
      :temp-coupon="tempCoupon"
      @update-coupon="updateCoupon"
    />
    <DelCouponModal
      :temp-coupon="tempCoupon"
      @delete-coupon="deleteCoupon"
    />
  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/back/Pagination.vue';
import CouponModal from '@/components/back/CouponModal.vue';
import DelCouponModal from '@/components/back/DelCouponModal.vue';

export default {
  components: {
    Pagination,
    CouponModal,
    DelCouponModal,
  },
  data() {
    return {
      coupons: [],
      tempCoupon: {},
      pagination: {},
      isNew: false,
      modalTitle: '',
      currentPage: '',
      loadingSuccess: false,
    };
  },
  mounted() {
    this.currentPage = this.$route.params.page;
    this.getCoupons(this.currentPage);
    this.$bus.$emit('update:routerActive');
  },
  methods: {
    getCoupons(page = 1) {
      this.$bus.$emit('update:loading', true);
      this.loadingSuccess = false;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupons?page=${page}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.coupons = response.data.coupons;
          this.pagination = response.data.pagination;
          if (this.pagination.total_pages && this.currentPage > this.pagination.total_pages) {
            this.$router.push({ params: { page: this.pagination.total_pages } });
          } else {
            this.loadingSuccess = true;
            this.$bus.$emit('update:loading', false);
          }
        } else {
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {};
        this.isNew = true;
        this.modalTitle = '新增優惠卷';
      } else {
        this.tempCoupon = { ...item };
        this.isNew = false;
        this.modalTitle = `編輯： ${this.tempCoupon.title} 優惠卷`;
      }
      $('#couponModal').modal('show');
    },
    deleteModal(item) {
      this.tempCoupon = { ...item };
      $('#delCouponModal').modal('show');
    },
    updateCoupon() {
      this.$bus.$emit('update:loading', true);
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon`;
      let httpMethod = 'post';
      if (!this.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${this.tempCoupon.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: this.tempCoupon }).then((response) => {
        if (response.data.success) {
          $('#couponModal').modal('hide');
          this.getCoupons(this.currentPage);
        } else {
          $('#couponModal').modal('hide');
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    deleteCoupon() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/coupon/${this.tempCoupon.id}`;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          $('#delCouponModal').modal('hide');
          this.getCoupons(this.currentPage);
        } else {
          $('#delCouponModal').modal('hide');
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = to.params.page;
    this.getCoupons(this.currentPage);
    $('#couponModal').modal('hide');
    $('#delCouponModal').modal('hide');
    next();
  },
  beforeRouteLeave(to, from, next) {
    $('#couponModal').modal('hide');
    $('#delCouponModal').modal('hide');
    next();
  },
};
</script>

<style lang="scss">
@media(max-width: 576px){
  .coupons-page{
    .btn-sm{
      display: block;
    }
    .btn-outline-primary{
      margin-bottom: 5px;
    }
  }
}
</style>
