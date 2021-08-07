<template>
  <div
    id="comfirmModal"
    class="modal fade"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <span>送出訂單</span>
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
          >
            <span>&times;</span>
          </button>
        </div>
        <div class="modal-body bg-light">
          <p class="text-center mb-0">
            是否送出訂單?
            <br>
            (若送出後資料將無法修改)。
          </p>
        </div>
        <div class="modal-footer bg-light">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary text-white"
            @click="createOrder"
          >
            送出訂單
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    createOrder() {
      this.$emit('create-order');
    },
  },
};
</script>

<style lang="scss">
#comfirmModal{
  .close{
    opacity: 1;
    color: #fff;
  }
  .btn{
    transition: 0.3s;
    &.btn-outline-secondary:hover{
      color: #00d2ff;
      background: transparent;
      transform: scale(1.1,1.1);
    }
    &.btn-primary:hover{
      background: #00d2ff;
      transform: scale(1.1,1.1);
    }
  }
}
</style>
