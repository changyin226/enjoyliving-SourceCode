<template>
  <div class="product-modal-component">
    <div
      id="productModal"
      class="modal fade"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title">
              <span>{{ modalTitle }}</span>
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
            <div class="form-row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input
                    id="image"
                    v-model="tempProduct.imgUrl"
                    type="text"
                    class="form-control mb-3"
                    name="圖片連結"
                    placeholder="請輸入圖片連結"
                  >
                  <input
                    v-model="tempProduct.imgUrl2"
                    type="text"
                    class="form-control"
                    name="圖片連結2"
                    placeholder="請輸入圖片連結2"
                  >
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i
                      v-if="status.fileUploading"
                      class="fa fa-spinner fa-spin fa-fw"
                    />
                  </label>
                  <input
                    id="customFile"
                    ref="files"
                    type="file"
                    class="form-control"
                    name="上傳圖片"
                    @change="uploadFileImg"
                  >
                </div>
                <img
                  v-if="tempProduct.imgUrl"
                  :src="tempProduct.imgUrl"
                  class="img-fluid"
                  alt="商品圖片"
                >
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input
                    id="title"
                    v-model="tempProduct.title"
                    type="text"
                    class="form-control"
                    name="標題"
                    placeholder="請輸入標題"
                  >
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input
                      id="category"
                      v-model="tempProduct.category"
                      type="text"
                      class="form-control"
                      name="分類"
                      placeholder="請輸入分類"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input
                      id="unit"
                      v-model="tempProduct.unit"
                      type="unit"
                      class="form-control"
                      name="單位"
                      placeholder="請輸入單位"
                    >
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="origin_price">原價</label>
                    <input
                      id="origin_price"
                      v-model="tempProduct.origin_price"
                      type="number"
                      class="form-control"
                      name="原價"
                      placeholder="請輸入原價"
                    >
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input
                      id="price"
                      v-model="tempProduct.price"
                      type="number"
                      class="form-control"
                      name="售價"
                      placeholder="請輸入售價"
                    >
                  </div>
                </div>
                <hr>
                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea
                    id="description"
                    v-model="tempProduct.description"
                    type="text"
                    class="form-control"
                    name="產品描述"
                    placeholder="請輸入產品描述"
                  />
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea
                    id="content"
                    v-model="tempProduct.content"
                    type="text"
                    class="form-control"
                    name="產品說明"
                    placeholder="請輸入產品說明內容"
                  />
                </div>
                <div class="form-group">
                  <label for="content">產品規格</label>
                  <textarea
                    id="content"
                    v-model="tempProduct.specification"
                    type="text"
                    class="form-control"
                    name="產品規格"
                    placeholder="請輸入產品規格"
                  />
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input
                      id="is_enabled"
                      v-model="tempProduct.is_enabled"
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
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary text-white"
              data-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary text-white"
              @click="updateProduct"
            >
              確認
            </button>
          </div>
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
    tempProduct: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      status: {
        fileUploading: false,
      },
    };
  },
  methods: {
    uploadFileImg() {
      const fileImg = this.$refs.files.files[0];
      const formData = new FormData();
      formData.append('file-to-upload', fileImg);
      const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
      this.status.fileUploading = true;
      this.$http.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        if (response.data.success) {
          this.$set(this.tempProduct, 'imgUrl', response.data.imageUrl);
          this.status.fileUploading = false;
        } else {
          this.status.fileUploading = false;
          this.$bus.$emit('message:push', response.data.message, 'danger');
        }
      });
    },
    updateProduct() {
      this.$emit('update-product');
    },
  },
};
</script>
