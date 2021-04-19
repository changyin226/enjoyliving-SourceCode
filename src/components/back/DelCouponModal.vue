<template>
  <div class="modal fade" id="delCouponModal">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>刪除優惠卷</span>
          </h5>
          <button type="button" class="close" data-dismiss="modal">
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body">
          是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠卷(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary text-white"
            data-dismiss="modal">
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="deleteCoupon">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tempCoupon: {
      type: Object,
      required: true,
    },
  },
  methods: {
    deleteCoupon() {
      this.$emit('delete-coupon');
    },
  },
};
</script>
