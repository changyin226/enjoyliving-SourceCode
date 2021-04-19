<template>
  <div class="favorites-page">
    <loading :active.sync="isLoading" color="#00d2ff" :lock-scroll="true"></loading>
    <div class="banner"></div>
    <div class="container py-5">
      <div class="row justify-content-center py-5">
        <div class="col-md-8">
          <div class="section-heading">
            <span>Enjoy Living</span>
            <h2>喜好項目</h2>
            <p>將感興趣的商品加入喜好項目，方便日後追蹤產品資訊</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4"
          v-for="product in perPageProducts[currentPage - 1]" :key="product.id">
          <ProductCard :product="product" @change-isLoading="isLoading = $event"></ProductCard>
        </div>
      </div>
      <div class="row py-5" v-if="favoriteProducts.length" :key="currentPage">
        <div class="col">
          <Pagination :current-page="currentPage" :total-page="perPageProducts.length">
          </Pagination>
        </div>
      </div>
      <div class="row justify-content-center py-5 animate__animated"
        v-if="loadingSuccess && !favoriteProducts.length"
        v-waypoint="{ active: true, callback: onWaypoint }">
        <div class="col-md-6 text-center border border-primary rounded py-5">
          <p class="notice mb-4">
            目前沒有追蹤的產品
            <br>
            快去產品頁逛逛吧
            <br>
          </p>
          <router-link to="/productlist/all/1" class="btn">SHOP</router-link>
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
      favoriteProducts: [],
      favoriteTitles: [],
      currentPage: 0,
      isLoading: false,
      loadingSuccess: false,
    };
  },
  computed: {
    perPageProducts() {
      const newProducts = [];
      this.favoriteProducts.forEach((product, i) => {
        if (i % 9 === 0) {
          newProducts.push([]);
        }
        const page = parseInt(i / 9, 10);
        newProducts[page].push(product);
      });
      return newProducts;
    },
  },
  methods: {
    getProduct() {
      this.isLoading = true;
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.favoriteProducts = response.data.products
            .filter((product) => this.favoriteTitles.includes(product.title));
          if (this.currentPage !== 1 && !this.perPageProducts[this.currentPage - 1]) {
            this.$router.push({ params: { page: this.currentPage - 1 } });
          }
          this.loadingSuccess = true;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.$router.push('/');
          this.$bus.$emit('message:push', response.data.messages);
        }
      });
    },
    onWaypoint({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        el.classList.add('animate__fadeInUp');
      }
    },
  },
  components: {
    ProductCard,
    Pagination,
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = parseInt(to.params.page, 10);
    this.$bus.$emit('hideOffCanvas');
    next();
  },
  activated() {
    this.currentPage = parseInt(this.$route.params.page, 10);
    this.favoriteTitles = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    if (this.favoriteProducts.length !== this.favoriteTitles.length) {
      this.loadingSuccess = false;
      this.getProduct();
    } else {
      this.loadingSuccess = true;
    }
    this.$bus.$emit('hideOffCanvas');
  },
};
</script>

<style lang="scss">
.favorites-page{
  .banner{
    background: url('../../assets/images/FavoritesBanner.jpg') center;
    background-size: cover;
  }
}
</style>
