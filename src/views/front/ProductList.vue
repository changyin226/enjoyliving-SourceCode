<template>
  <div class="product-list-page">
    <loading :active.sync="isLoading" color="#00d2ff" :lock-scroll="true"></loading>
    <div class="banner"></div>
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
      <div class="filter mb-5" v-if="products.length">
        <div class="filter-tabs row" v-if="screenWidth > 768">
          <div class="col-4 col-md-2 mb-3" v-for="item in categories" :key="item">
            <router-link
              :to="{params: { category: TCtoEN[item] , page: 1}}"
              class="btn"
              :class="{ active : category === item}"
              @click.native="category = item">
              {{ item }}
            </router-link>
          </div>
        </div>
        <div class="filter-select" v-else>
          <select class="custom-select mb-4" v-model="category"
            @change="selectChangePage(category)">
            <option :value="item" v-for="item in categories" :key="item">
              {{ item }}
            </option>
          </select>
        </div>
      </div>
        <div class="row">
          <div class="col-md-4"
            v-for="product in perPageProducts[currentPage - 1]"
            :key="category + product.id">
            <ProductCard :product="product" @change-isLoading="isLoading = $event"></ProductCard>
          </div>
        </div>
      <div class="row py-5" v-if="products[0]" :key="category + currentPage">
        <div class="col" v-if="products.length" :key="category + currentPage">
          <Pagination :current-page="currentPage" :total-page="perPageProducts.length">
          </Pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/front/ProductCard.vue';
import Pagination from '@/components/front/Pagination.vue';

export default {
  data() {
    return {
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
      isLoading: false,
    };
  },
  computed: {
    filterCategoryProduct() {
      const newProducts = [];
      if (this.category === '全部') return this.products;
      this.products.forEach((product) => {
        if (product.category === this.category) {
          newProducts.push(product);
        }
      });
      return newProducts;
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
  methods: {
    getProducts() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.products = response.data.products.filter((product) => product.is_enabled);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.$router.push('/');
          this.$bus.$emit('message:push', response.data.messages);
        }
      });
    },
    selectChangePage(item) {
      this.$router.push({ params: { category: this.TCtoEN[item], page: 1 } });
    },
  },
  components: {
    ProductCard,
    Pagination,
  },
  mounted() {
    this.getProducts();
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = parseInt(to.params.page, 10);
    this.category = this.ENtoTC[to.params.category];
    this.$bus.$emit('hideOffCanvas');
    next();
  },
  activated() {
    this.currentPage = parseInt(this.$route.params.page, 10);
    this.category = this.ENtoTC[this.$route.params.category];
    this.screenWidth = window.innerWidth;
    this.$bus.$emit('hideOffCanvas');
    document.body.classList.remove('vld-shown');
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
