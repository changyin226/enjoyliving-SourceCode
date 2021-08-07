<template>
  <div class="products-page">
    <div class="text-right">
      <button
        type="button"
        class="btn btn-primary mt-4 text-white"
        @click="openModal(true)"
      >
        建立新的產品
      </button>
    </div>
    <table
      v-if="products.length"
      class="table mt-4"
    >
      <thead>
        <tr class="text-center text-white">
          <th class="d-none d-sm-table-cell">
            分類
          </th>
          <th>產品名稱</th>
          <th class="d-none d-sm-table-cell">
            原價
          </th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in products"
          :key="product.id"
          class="text-center text-white"
        >
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
            <span
              v-if="product.is_enabled"
              class="text-secondary align-middle"
            >啟用</span>
            <span
              v-else
              class="text-danger"
            >未啟用</span>
          </td>
          <td class="align-middle">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm mx-auto mx-md-1"
              @click="openModal(false, product)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm mx-auto mx-md-1"
              @click="deleteModal(product)"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="loadingSuccess && !products.length"
      class="text-center border border-primary rounded mt-5 py-5"
    >
      <p class="notice mb-0 py-5">
        沒有已建立的商品
      </p>
    </div>
    <Pagination
      v-if="products.length"
      :pagination="pagination"
      class="my-5"
    />
    <ProductModal
      :modal-title="modalTitle"
      :temp-product="tempProduct"
      @update-product="updateProduct"
    />
    <DelProductModal
      :temp-product="tempProduct"
      @delete-product="deleteProduct"
    />
  </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '@/components/back/Pagination.vue';
import ProductModal from '@/components/back/ProductModal.vue';
import DelProductModal from '@/components/back/DelProductModal.vue';

export default {
  components: {
    Pagination,
    ProductModal,
    DelProductModal,
  },
  data() {
    return {
      products: [],
      tempProduct: {},
      modalTitle: '',
      pagination: {},
      currentPage: 0,
      isNew: false,
      loadingSuccess: false,
    };
  },
  mounted() {
    this.currentPage = this.$route.params.page;
    this.getProducts(this.currentPage);
    this.$bus.$emit('update:routerActive');
  },
  methods: {
    getProducts(page = 1) {
      this.$bus.$emit('update:loading', true);
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
      this.$bus.$emit('update:loading', true);
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
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    deleteProduct() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${this.tempProduct.id}`;
      this.$http.delete(api).then((response) => {
        if (response.data.success) {
          $('#delProductModal').modal('hide');
          this.getProducts(this.currentPage);
        } else {
          $('#delProductModal').modal('hide');
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
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
