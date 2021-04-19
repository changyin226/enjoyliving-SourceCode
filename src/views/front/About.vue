<template>
  <div class="about-page">
    <div class="banner"></div>
    <div class="container py-5">
      <div class="row py-5 about-info animate__animated"
        v-waypoint="{ active: true, callback: onWaypoint }">
        <div class="col-md-6">
          <div class="desc mb-5">
            <h3>公司歷史</h3>
            <p class="mb-3">
              享住Enjoy Living創立於2000年，以提供頂尖的家具，以及高品質的居家用品聞名。
              至今，我們持續研發設計新世代的家具，以無與倫比的絕佳體驗為消費者織就美好居家生活。
            </p>
          </div>
          <div class="desc mb-5">
            <h3>公司願景</h3>
            <p class="mb-3">
              我們的理念起源於為大多數人提供價格實惠的家具家飾，而非僅為了少數人。
              透過將功能、品質、設計和價值結合在一起，而且始終秉持著永續要素，
              並透過設計、採購、包裝、配送與經營業務模式，
              在每一個環節都體現我們的理念，
              實踐我們的願景：為大多數人創造更美好的生活。
            </p>
            <p>
              一直以來，我們最棒的點子總是來自於最嚴峻的挑戰，我們相信這就是我們與眾不同的原因。
              現在，我們持續為了目標努力，替人們創造更舒適的日常生活。
            </p>
          </div>
        </div>
        <div class="col-md-6">
          <img class="mb-5" src="@/assets/images/AboutImg.jpg" alt="公司圖片">
        </div>
      </div>
      <div class="row justify-content-center py-5">
        <div class="col-md-8">
          <div class="section-heading animate__animated"
            v-waypoint="{ active: true, callback: onWaypoint }">
            <span>Enjoy Living Staff</span>
            <h2>公司團隊</h2>
            <p>
              我們追求並相信「大眾化設計」的價值。好的家具是為每個人所設計，結合了形式、功能、品質、永續發展及人人負擔得起的價格。
            </p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4 text-center py-5">
          <div class="staff animate__animated"
            v-waypoint="{ active: true, callback: onWaypointList }">
            <img src="https://randomuser.me/api/portraits/lego/8.jpg" alt="員工照片">
            <h3>Jean Smith</h3>
            <span>Chief Executive Officer</span>
            <p>
              領導著一支以結果為導向的才華橫溢的團隊，該團隊以提供全面，集成的營銷和戰略傳播顧問而聞名。
            </p>
          </div>
        </div>
        <div class="col-md-4 text-center py-5">
          <div class="staff animate__animated"
            v-waypoint="{ active: true, callback: onWaypointList }">
            <img src="https://randomuser.me/api/portraits/lego/2.jpg" alt="員工照片">
            <h3>Hush Raven</h3>
            <span>Co-Owner</span>
            <p>
            作為眾多工作職責的一部分，負責人力資源管理，並負責招募在此工作的所有傑出人才，樹立公司文化並使其成為一個理想的工作場所。
            </p>
          </div>
        </div>
        <div class="col-md-4 text-center py-5">
          <div class="staff animate__animated"
            v-waypoint="{ active: true, callback: onWaypointList }">
            <img src="https://randomuser.me/api/portraits/lego/0.jpg" alt="員工照片">
            <h3>Alex King</h3>
            <span>Co-Owner</span>
            <p>
              領導公司的運營，IT和客服團隊，致力於改善公司的服務。他的職責包括調整公司的流程，系統和客戶管理模型，以提供一致的客戶和員工體驗。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onWaypoint({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        el.classList.add('animate__fadeInUp');
      }
    },
    onWaypointList({ el, going }) {
      if (going === this.$waypointMap.GOING_IN) {
        const animate = document.querySelectorAll('.staff.animate__animated');
        const arr = Array.from(animate);
        const index = arr.indexOf(el);
        setTimeout(() => {
          el.classList.add('animate__fadeInUp');
        }, index * 200);
      }
    },
  },
  mounted() {
    this.$bus.$emit('hideOffCanvas');
  },
};
</script>

<style lang="scss">
.about-page{
  .banner{
    background: url(../../assets/images/AboutBanner.jpg) center;
    background-size: cover;
  }
  .about-info{
    img{
      border: 2px solid;
      padding: 10px;
      max-width: 100%;
      border-image: linear-gradient(135deg, #00d2ff 0%, #00cdac 100%);
      border-image-slice: 1;
    }
    .desc{
      h3{
        font-size: 24px;
        margin-bottom: 20px;
      }
    }
  }
  .staff{
    img{
      width: 170px;
      height: 170px;
      border: 2px solid #00d2ff;
      border-radius: 50%;
      margin-bottom: 20px;
    }
    h3{
      font-size: 24px;
      margin-bottom: 5px;
    }
    span{
      color: #bfbfbf;
      margin-bottom: 20px;
      font-weight: normal;
      display: block;
    }
  }
}
</style>
