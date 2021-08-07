<template>
  <div
    id="couponModal"
    class="modal fade"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            {{ modalTitle }}
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
          >
            <span class="text-white">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="title">標題</label>
            <input
              id="title"
              v-model="tempCoupon.title"
              type="text"
              class="form-control"
              name="標題"
              placeholder="請輸入標題"
            >
          </div>
          <div class="form-group">
            <label for="code">優惠碼</label>
            <input
              id="code"
              v-model="tempCoupon.code"
              type="text"
              class="form-control"
              name="優惠卷"
              placeholder="請輸入優惠碼"
            >
          </div>
          <div class="form-group">
            <label for="due_date">到期日</label>
            <input
              id="due_date"
              v-model="due_date"
              type="date"
              class="form-control"
              name="到期日"
              placeholder="請輸入到期日"
            >
          </div>
          <div class="form-group">
            <label for="percent">折扣百分比</label>
            <input
              id="percent"
              v-model="tempCoupon.percent"
              type="text"
              class="form-control"
              name="折扣"
              placeholder="請輸入折扣百分比"
            >
          </div>
          <div class="form-group">
            <div class="form-check">
              <input
                id="is_enabled"
                v-model="tempCoupon.is_enabled"
                class="form-check-input"
                type="checkbox"
                name="啟用"
                :true-value="1"
                :false-value="0"
              >
              <label
                class="form-check-label"
                for="is_enabled"
              >
                是否啟用
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary text-white"
            @click="updateCoupon"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    modalTitle: {
      type: String,
      required: true,
    },
    tempCoupon: {
      type: Object,
      required: true,
    },
  },
  computed: {
    due_date: {
      get() {
        if (!this.tempCoupon.due_date) return '';
        return this.timestampConverter(this.tempCoupon.due_date);
      },
      set(val) {
        this.tempCoupon.due_date = Math.floor(new Date(val) / 1000);
      },
    },
  },
  methods: {
    updateCoupon() {
      this.$emit('update-coupon');
    },
    timestampConverter(timestamp) {
      const dateline = new Date();
      dateline.setTime(timestamp * 1000);
      const year = dateline.getFullYear();
      let month = dateline.getMonth() + 1;
      if (month < 10) month = `0${month}`;
      let date = dateline.getDate();
      if (date < 10) date = `0${date}`;
      return `${year}-${month}-${date}`;
    },
  },
};
</script>
