<template>
  <div class="products-page">
    <loading :active.sync="isLoading" color="#00d2ff" :lock-scroll="true"></loading>
    <div class="text-right">
      <button type="button" class="btn btn-primary mt-4 text-white"
        @click="openModal(true)">
        建立新的產品
      </button>
    </div>
    <table class="table mt-4" v-if="products.length">
      <thead>
        <tr class="text-center text-white">
          <th class="d-none d-sm-table-cell">分類</th>
          <th>產品名稱</th>
          <th class="d-none d-sm-table-cell">原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center text-white" v-for="product in products" :key="product.id">
          <td class="d-none d-sm-table-cell align-middle">
            {{ product.category }}
          </td>
          <td class="align-middle">
            {{ product.title }}
          </td>
          <td class="d-none d-sm-table-cell text-right align-middle">
            {{ product.origin_price | currency }}
          </td>
          <td class="text-right align-middle">
            {{ product.price | currency }}
          </td>
          <td class="align-middle">
            <span v-if="product.is_enabled" class="text-secondary align-middle">啟用</span>
            <span v-else class="text-danger">未啟用</span>
          </td>
          <td class="align-middle">
            <button type="button" class="btn btn-outline-primary btn-sm mx-auto mx-md-1"
              @click="openModal(false, product)">
              編輯
            </button>
            <button type="button" class="btn btn-outline-danger btn-sm mx-auto mx-md-1"
              @click="deleteModal(product)">
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center border border-primary rounded mt-5 py-5"
      v-if="loadingSuccess && !products.length">
      <p class="notice mb-0 py-5">
        沒有已建立的商品
      </p>
    </div>
    <Pagination v-if="products.length" :pagination="pagination" class="my-5"></Pagination>
    <ProductModal :modalTitle="modalTitle" :tempProduct="tempProduct"
      @update-product="updateProduct"></ProductModal>
    <DelProductModal :tempProduct="tempProduct" @delete-product="deleteProduct"></DelProductModal>
  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/back/Pagination.vue';
import ProductModal from '@/components/back/ProductModal.vue';
import DelProductModal from '@/components/back/DelProductModal.vue';

export default {
  data() {
    return {
      products: [],
      tempProduct: {},
      modalTitle: '',
      pagination: {},
      currentPage: 0,
      isNew: false,
      loadingSuccess: false,
      isLoading: false,
    };
  },
  components: {
    Pagination,
    ProductModal,
    DelProductModal,
  },
  methods: {
    getProducts(page = 1) {
      this.isLoading = true;
      this.loadingSuccess = false;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.products = response.data.products;
          this.pagination = response.data.pagination;
          if (this.pagination.total_pages && this.currentPage > this.pagination.total_pages) {
            this.$router.push({ params: { page: this.pagination.total_pages } });
          } else {
            this.loadingSuccess = true;
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
        this.isNew = true;
        this.modalTitle = '新增產品';
      } else {
        this.tempProduct = { ...item };
        this.isNew = false;
        this.modalTitle = `編輯: ${this.tempProduct.title}`;
      }
      $('#productModal').modal('show');
    },
    deleteModal(item) {
      this.tempProduct = { ...item };
      $('#delProductModal').modal('show');
    },
    updateProduct() {
      this.isLoading = true;
      let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
      let httpMethod = 'post';
      if (!this.isNew) {
        api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${this.tempProduct.id}`;
        httpMethod = 'put';
      }
      this.$http[httpMethod](api, { data: this.tempProduct }).then((response) => {
        if (response.data.success) {
          $('#productModal').modal('hide');
          this.getProducts(this.currentPage);
        } else {
          $('#productModal').modal('hide');
          this.isLoading = false;
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    deleteProduct() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          $('#delProductModal').modal('hide');
          this.getProducts(this.currentPage);
        } else {
          $('#delProductModal').modal('hide');
          this.isLoading = false;
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
  },
  mounted() {
    this.currentPage = this.$route.params.page;
    this.getProducts(this.currentPage);
    this.$bus.$emit('update:routerActive');
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = to.params.page;
    this.getProducts(this.currentPage);
    $('#productModal').modal('hide');
    $('#delProductModal').modal('hide');
    next();
  },
  beforeRouteLeave(to, from, next) {
    $('#productModal').modal('hide');
    $('#delProductModal').modal('hide');
    next();
  },
};
</script>

<style lang="scss">
@media(max-width: 800px){
  .products-page{
    .btn-sm{
      display: block;
    }
    .btn-outline-primary{
      margin-bottom: 5px;
    }
  }
}
</style>
