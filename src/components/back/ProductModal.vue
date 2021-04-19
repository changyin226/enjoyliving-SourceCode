<template>
  <div class="product-modal-component">
    <div class="modal fade" id="productModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content border-0">
          <div class="modal-header">
            <h5 class="modal-title">
              <span>{{ modalTitle }}</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal">
              <span class="text-white">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="col-sm-4">
                <div class="form-group">
                  <label for="image">輸入圖片網址</label>
                  <input type="text" class="form-control mb-3" id="image" name="圖片連結"
                    v-model="tempProduct.imgUrl"
                    placeholder="請輸入圖片連結">
                  <input type="text" class="form-control" name="圖片連結2"
                    v-model="tempProduct.imgUrl2"
                    placeholder="請輸入圖片連結2">
                </div>
                <div class="form-group">
                  <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" name="上傳圖片"
                    @change="uploadFileImg" ref="files">
                </div>
                <img v-if="tempProduct.imgUrl" :src="tempProduct.imgUrl"
                  class="img-fluid" alt="商品圖片">
              </div>
              <div class="col-sm-8">
                <div class="form-group">
                  <label for="title">標題</label>
                  <input type="text" class="form-control" id="title" name="標題"
                    v-model="tempProduct.title"
                    placeholder="請輸入標題">
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category" name="分類"
                      v-model="tempProduct.category"
                      placeholder="請輸入分類">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit" name="單位"
                      v-model="tempProduct.unit"
                      placeholder="請輸入單位">
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                  <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price" name="原價"
                      v-model="tempProduct.origin_price"
                      placeholder="請輸入原價">
                  </div>
                  <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price" name="售價"
                      v-model="tempProduct.price"
                      placeholder="請輸入售價">
                  </div>
                </div>
                <hr>
                <div class="form-group">
                  <label for="description">產品描述</label>
                  <textarea type="text" class="form-control" id="description" name="產品描述"
                    v-model="tempProduct.description"
                    placeholder="請輸入產品描述"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">說明內容</label>
                  <textarea type="text" class="form-control" id="content" name="產品說明"
                    v-model="tempProduct.content"
                    placeholder="請輸入產品說明內容"></textarea>
                </div>
                <div class="form-group">
                  <label for="content">產品規格</label>
                  <textarea type="text" class="form-control" id="content" name="產品規格"
                    v-model="tempProduct.specification"
                    placeholder="請輸入產品規格"></textarea>
                </div>
                <div class="form-group">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="啟用"
                      v-model="tempProduct.is_enabled"
                      :true-value="1"
                      :false-value="0"
                      id="is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary text-white"
              data-dismiss="modal">
              取消
            </button>
            <button type="button" class="btn btn-primary text-white"
              @click="updateProduct">
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
  data() {
    return {
      status: {
        fileUploading: false,
      },
    };
  },
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
