<template>
  <div class="product-page">
    <div class="banner" />
    <div
      v-if="!imgShow"
      class="blank"
    />
    <div
      class="container mb-5"
    >
      <img
        class="product-page-img"
        :src="product.imgUrl2"
        alt="商品圖片"
        @load="imgShow = true"
      >
      <div v-if="imgShow">
        <div
          :key="`Info:${product.title}`"
          v-waypoint="{ active: true, callback: onWaypointList }"
          class="product-info animate__animated"
        >
          <h2>{{ product.title }}</h2>
          <span>{{ product.description }}</span>
          <del v-if="product.price !== product.origin_price">
            原價 NT {{ product.origin_price | currency }} / {{ product.unit }}
          </del>
          <h3 v-if="product.price === product.origin_price">
            NT {{ product.origin_price | currency }} / {{ product.unit }}
          </h3>
          <h3 v-else>
            NT {{ product.price | currency }} / {{ product.unit }}
          </h3>
        </div>
        <div
          :key="`form:${product.title}`"
          v-waypoint="{ active: true, callback: onWaypointList }"
          class="row justify-content-center align-items-center mb-3 animate__animated"
        >
          <div class="col-md-4 mb-3">
            <select
              v-model="product.num"
              class="form-control"
            >
              <option
                v-for="num in 10"
                :key="num"
                :value="num"
              >
                選購 {{ num }} {{ product.unit }}
              </option>
            </select>
          </div>
          <div class="col-md-4 mb-3 d-flex align-items-center">
            <button
              type="button"
              class="btn btn-lg w-100 mr-3 add-cart-btn"
              @click="addToCart(product.num)"
            >
              加入購物車
            </button>
            <button
              type="button"
              class="toogle-favorite"
            >
              <i
                class="fa"
                :class="isFavorite? 'fa-heart': 'fa-heart-o'"
                @click="toggleFavorite(isFavorite)"
              />
            </button>
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-md-10 mb-3">
            <div
              :key="`detail:${product.title}`"
              v-waypoint="{ active: true, callback: onWaypointList }"
              class="product-detail animate__animated"
            >
              <ul class="tab-nav">
                <li :class="{active: tabNav === 'detail'}">
                  <button
                    type="button"
                    @click="tabNav = 'detail'"
                  >
                    產品資訊
                  </button>
                </li>
                <li :class="{active: tabNav === 'size'}">
                  <button
                    type="button"
                    @click="tabNav = 'size'"
                  >
                    產品尺寸
                  </button>
                </li>
              </ul>
              <transition
                name="fade"
                mode="out-in"
              >
                <p
                  v-if="tabNav === 'detail'"
                  ref="height"
                  key="detail"
                >
                  {{ product.content }}
                </p>
                <p
                  v-else
                  key="size"
                  :style="{height: heightRef + 'px'}"
                >
                  {{ product.specification }}
                </p>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="similarProducts.length"
      v-waypoint="{ active: true, callback: onWaypoint }"
      class="container-fluid py-5 animate__animated"
    >
      <div class="container pt-0">
        <h2 class="text-center py-5">
          其他相似商品
        </h2>
        <swiper
          class="swiper"
          :options="swiperOptions"
        >
          <swiper-slide
            v-for="item in similarProducts"
            :key="item.id"
          >
            <ProductCard
              :product="item"
            />
          </swiper-slide>
          <div
            slot="button-next"
            class="swiper-button-next"
          />
          <div
            slot="button-prev"
            class="swiper-button-prev"
          />
          <div
            slot="pagination"
            class="swiper-pagination"
          />
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from '@/components/front/ProductCard.vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/css/swiper.css';

export default {
  components: {
    ProductCard,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      id: '',
      product: {},
      tabNav: 'detail',
      favoriteProducts: [],
      similarProducts: [],
      swiperOptions: {
        slidesPerView: 1,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 25,
          },
        },
        observer: true,
        observeParents: true,
      },
      imgShow: false,
    };
  },
  computed: {
    heightRef() {
      if (this.product.title) return this.$refs.height.clientHeight;
      return 0;
    },
    isFavorite() {
      if (this.favoriteProducts.includes(this.product.title)) return true;
      return false;
    },
  },
  mounted() {
    this.favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    this.id = this.$route.params.id;
    this.getProduct();
    this.$bus.$emit('hideOffCanvas');
  },
  methods: {
    getProduct() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${this.id}`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          this.product = response.data.product;
          this.product.num = 1;
          this.getSimilarProducts();
          this.$bus.$emit('update:loading', false);
        } else {
          this.$bus.$emit('update:loading', false);
          this.$router.push('/productlist/all/1');
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    getSimilarProducts() {
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`;
      this.$http.get(api).then((response) => {
        if (response.data.success) {
          const similarArray = response.data.products
            .filter((product) => product.category === this.product.category
            && product.title !== this.product.title);
          this.similarProducts = similarArray.filter((product, i) => i < 10);
        } else {
          this.$bus.$emit('message:push', '取得相似產品失敗');
        }
      });
    },
    addToCart(qty) {
      this.$bus.$emit('update:loading', true);
      const cartArray = JSON.parse(localStorage.getItem('cartProducts')) || [];
      const cacheId = cartArray.map((product) => product.product_id);
      if (cacheId.includes(this.product.id)) {
        let cart = {};
        cartArray.forEach((product, index) => {
          if (product.product_id === this.product.id) {
            let oldQty = product.qty;
            cart = {
              product_id: this.product.id,
              qty: oldQty += qty,
            };
            cartArray.splice(index, 1);
          }
        });
        cartArray.push(cart);
      } else {
        const cart = {
          product_id: this.product.id,
          qty,
        };
        cartArray.push(cart);
      }
      localStorage.setItem('cartProducts', JSON.stringify(cartArray));
      this.$bus.$emit('update:cartNum');
      this.$bus.$emit('message:push', '已加入購物車', 'primary');
      setTimeout(() => {
        this.$bus.$emit('update:loading', false);
      }, 500);
    },
    toggleFavorite(isFavorite) {
      const { title } = this.product;
      const index = this.favoriteProducts.indexOf(title);
      if (isFavorite) {
        this.favoriteProducts.splice(index, 1);
        this.$bus.$emit('message:push', '已移出喜好項目', 'primary');
      } else {
        this.favoriteProducts.push(title);
        this.$bus.$emit('message:push', '已加入喜好項目', 'primary');
      }
      localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
    },
    onWaypoint({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        setTimeout(() => {
          el.classList.add('animate__fadeInUp');
        }, 500);
      }
    },
    onWaypointList({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        const animate = document.querySelectorAll('.animate__animated');
        const arr = Array.from(animate);
        const index = arr.indexOf(el);
        setTimeout(() => {
          el.classList.add('animate__fadeInUp');
        }, index * 200);
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.id = to.params.id;
    this.similarProducts = [];
    this.getProduct();
    this.tabNav = 'detail';
    this.$bus.$emit('hideOffCanvas');
    next();
  },
};
</script>

<style lang="scss">
.product-page{
  .fade-enter-active, .fade-leave-active {
    transition: all 0.15s;
  }
  .fade-enter, .fade-leave-to{
    opacity: 0;
  }
  .banner{
    background: url('../../assets/images/ProductPageBanner.jpg') center;
    background-size: cover;
  }
  .container{
    padding-top: 50px;
    padding-bottom: 50px;
  }
  .product-page-img{
    display: block;
    width: 100%;
    max-width: 650px;
    height: auto;
    margin: 0 auto 30px;
  }
  .product-info{
    text-align: center;
    h2{
      font-size: 32px;
    }
    h3{
      font-size: 22px;
      margin-bottom: 30px;
    }
    span{
      display: block;
      color: #828282;
      font-size: 16px;
      font-weight: 400;
      letter-spacing: 1px;
      font-family: "Montserrat", Arial, sans-serif;
      margin-bottom: 30px;
    }
    del{
      display: block;
      color: #828282;
      font-size: 16px;
      letter-spacing: 1px;
      font-family: "Montserrat", Arial, sans-serif;
      margin-bottom: 10px;
    }
  }
  .form-control{
    height: 48px;
    border: 1px solid #00cdac;
    &:focus{
      box-shadow: none;
    }
  }
  .product-detail{
    p{
      width: 90%;
      margin: 0 auto;
      letter-spacing: 2px;
    }
  }
  .container-fluid{
    background: rgba(0, 0, 0, 0.05);
    .swiper-button-next, .swiper-button-prev{
      color: #00d2ff;
    }
    .swiper-pagination-bullet-active{
      background: #00d2ff;
    }
    .discount{
      right: -30px;
      span{
        position: relative;
        right: -8px;
      }
      &:before, &:after{
        display: none;
      }
    }
  }
}
.toogle-favorite{
  font-size: 30px;
  color: #00d2ff;
  background: none;
  border: none;
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
.tab-nav{
  display: flex;
  list-style: none;
  margin: 0 auto 30px auto;
  padding: 3px;
  background: #f2f2f2;
  border-radius: 4px;
  li{
    width: 100%;
    &.active{
      button{
        background: #fff;
        color: #00d2ff;
      }
    }
  }
  button{
    width: 100%;
    padding: 20px;
    color: #b3b3b3;
    transition: 0.3s;
    border: none;
    background: none;
    border-radius: 4px;
    &:hover{
      color: #000;
    }
    &:focus{
      outline: none;
    }
  }
}
@media(max-width: 768px){
  .toogle-favorite{
    &:hover{
      i{
        transform: none;
      }
    }
  }
  .product-page{
    button.add-cart-btn:hover{
      color: #00d2ff;
      background: transparent;
    }
  }
}
</style>
