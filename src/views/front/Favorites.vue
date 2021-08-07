<template>
  <div class="favorites-page">
    <div class="banner" />
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
      <div
        v-if="!loadingSuccess"
        class="blank"
      />
      <div class="row">
        <div
          v-for="(product, i) in perPageProducts[currentPage - 1]"
          :key="product.id"
          class="col-md-4"
        >
          <button
            type="button"
            class="delete-favorite"
            title="移除喜好項目"
            @click="delFavorite(i)"
          >
            <i class="fa fa-heart" />
          </button>
          <ProductCard
            :product="product"
          />
        </div>
      </div>
      <div
        v-if="favoriteProducts.length"
        :key="currentPage"
        class="row py-5"
      >
        <div class="col">
          <Pagination
            :current-page="currentPage"
            :total-page="perPageProducts.length"
          />
        </div>
      </div>
      <div
        v-if="loadingSuccess && !favoriteProducts.length"
        v-waypoint="{ active: true, callback: onWaypoint }"
        class="row justify-content-center py-5 animate__animated"
      >
        <div class="col-md-6 text-center border border-primary rounded py-5">
          <p class="notice mb-4">
            目前沒有追蹤的產品
            <br>
            快去產品頁逛逛吧
            <br>
          </p>
          <router-link
            to="/productlist/all/1"
            class="btn"
          >
            SHOP
          </router-link>
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
      favoriteProducts: [],
      favoriteTitles: [],
      currentPage: 0,
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
  methods: {
    getProduct() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.favoriteProducts = response.data.products
            .filter((product) => this.favoriteTitles.includes(product.title));
          if (this.currentPage !== 1 && !this.perPageProducts[this.currentPage - 1]) {
            this.$router.push({ params: { page: this.currentPage - 1 } });
          }
          this.loadingSuccess = true;
          this.$bus.$emit('update:loading', false);
        } else {
          this.$bus.$emit('update:loading', false);
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
    delFavorite(i) {
      this.favoriteProducts.splice(i, 1);
      this.favoriteTitles.splice(i, 1);
      localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteTitles));
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.currentPage = parseInt(to.params.page, 10);
    this.$bus.$emit('hideOffCanvas');
    next();
  },
};
</script>

<style lang="scss">
.favorites-page{
  .banner{
    background: url('../../assets/images/FavoritesBanner.jpg') center;
    background-size: cover;
  }
  .delete-favorite{
    position: absolute;
    font-size: 30px;
    color: #00d2ff;
    background: none;
    border: none;
    padding: 0;
    top: 15px;
    left: 30px;
    z-index: 1;
    i{
      transition: 0.3s;
    }
    &:hover{
      cursor: pointer;
      i{
        transform: scale(1.2,1.2);
      }
    }
    &:focus{
      outline: none;
    }
  }
}
</style>
