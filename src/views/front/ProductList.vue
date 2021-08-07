<template>
  <div class="product-list-page">
    <div class="banner" />
    <div class="container py-5">
      <div class="row justify-content-center py-5">
        <div class="col-md-8">
          <div class="section-heading">
            <span>Enjoy Living</span>
            <h2>所有產品</h2>
            <p>我們提供價格實惠的產品，但這並不代表我們會犧牲產品的品質或安全。我們的產品皆重視產品安全，並對健康與環境友善。</p>
          </div>
        </div>
      </div>
      <div
        v-if="!loadingSuccess"
        class="blank"
      />
      <div
        v-if="products.length"
        class="filter mb-5"
      >
        <div
          v-if="screenWidth > 768"
          class="filter-tabs row"
        >
          <div
            v-for="item in categories"
            :key="item"
            class="col-4 col-md-2 mb-3"
          >
            <router-link
              :to="{params: { category: TCtoEN[item] , page: 1}}"
              class="btn"
              :class="{ active : category === item}"
              @click.native="category = item"
            >
              {{ item }}
            </router-link>
          </div>
        </div>
        <div
          v-else
          class="filter-select"
        >
          <select
            v-model="category"
            class="custom-select mb-4"
            @change="selectChangePage(category)"
          >
            <option
              v-for="item in categories"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div
          v-for="product in perPageProducts[currentPage - 1]"
          :key="category + product.id"
          class="col-md-4"
        >
          <ProductCard
            :product="product"
          />
        </div>
      </div>
      <div
        v-if="products[0]"
        :key="category + currentPage"
        class="row py-5"
      >
        <div
          v-if="products.length"
          :key="category + currentPage"
          class="col"
        >
          <Pagination
            :current-page="currentPage"
            :total-page="perPageProducts.length"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/front/ProductCard.vue';
import Pagination from '@/components/front/Pagination.vue';

export default {
  components: {
    ProductCard,
    Pagination,
  },
  data() {
    return {
      loadingSuccess: false,
      products: [],
      category: '',
      currentPage: 0,
      screenWidth: 0,
      TCtoEN: {
        全部: 'all',
        沙發: 'sofa',
        衣櫃: 'wardrobes',
        餐桌: 'dining-tables',
        電腦桌: 'computer-desk',
        書櫃: 'bookcases',
        餐椅: 'dining-seating',
        玻璃門櫃: 'display-cabinets',
        鞋櫃: 'shoe-cabinets',
        桌燈: 'table-lamps',
        落地燈: 'floor-lamps',
        電視櫃: 'tv-benches',
      },
      ENtoTC: {
        all: '全部',
        sofa: '沙發',
        wardrobes: '衣櫃',
        'dining-tables': '餐桌',
        'computer-desk': '電腦桌',
        bookcases: '書櫃',
        'dining-seating': '餐椅',
        'display-cabinets': '玻璃門櫃',
        'shoe-cabinets': '鞋櫃',
        'table-lamps': '桌燈',
        'floor-lamps': '落地燈',
        'tv-benches': '電視櫃',
      },
    };
  },
  computed: {
    filterCategoryProduct() {
      if (this.category === '全部') return this.products;
      return this.products.filter((product) => product.category === this.category);
    },
    perPageProducts() {
      const newProducts = [];
      this.filterCategoryProduct.forEach((product, i) => {
        if (i % 9 === 0) {
          newProducts.push([]);
        }
        const page = parseInt(i / 9, 10);
        newProducts[page].push(product);
      });
      return newProducts;
    },
    categories() {
      const categories = ['全部'];
      this.products.forEach((product) => {
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }
      });
      return categories;
    },
  },
  mounted() {
    this.getProducts();
  },
  activated() {
    this.currentPage = parseInt(this.$route.params.page, 10);
    this.category = this.ENtoTC[this.$route.params.category];
    this.screenWidth = window.innerWidth;
    this.$bus.$emit('hideOffCanvas');
  },
  methods: {
    getProducts() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.products = response.data.products.filter((product) => product.is_enabled);
          this.loadingSuccess = true;
          this.$bus.$emit('update:loading', false);
        } else {
          this.$bus.$emit('update:loading', false);
          this.$router.push('/');
          this.$bus.$emit('message:push', response.data.messages);
        }
      });
    },
    selectChangePage(item) {
      this.$router.push({ params: { category: this.TCtoEN[item], page: 1 } });
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = parseInt(to.params.page, 10);
    this.category = this.ENtoTC[to.params.category];
    this.$bus.$emit('hideOffCanvas');
    next();
  },
};
</script>

<style lang="scss">
.product-list-page{
  .banner{
    background: url('../../assets/images/ProductListBanner.jpg') center;
    background-size: cover;
  }
  .filter::after{
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background-image: linear-gradient(135deg, #00d2ff 0%, #00cdac 100%);
  }
  .filter-tabs{
    .btn{
      width: 100%;
      transition: 0.3s;
      &:hover{
        color: #00d2ff;
        transform: scale(1.1,1.1);
        background: none;
      }
      &.active{
        color: #fff;
        background: #00d2ff;
      }
    }
  }
  .filter-select{
    .custom-select{
      border: 1px solid  #00d2ff;
      &:focus{
        box-shadow: none;
      }
    }
  }
}
</style>
