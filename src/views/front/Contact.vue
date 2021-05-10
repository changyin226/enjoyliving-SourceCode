<template>
  <div class="contact-page">
    <div class="banner"></div>
    <div class="container">
      <div class="row justify-content-center py-5 my-5 animate__animated"
        v-waypoint="{ active: true, callback: onWaypointList }">
        <div class="col-md-4">
          <div class="contact-info">
            <h3>聯絡資訊</h3>
            <ul>
              <li class="address d-flex">
                <i class="fa fa-map-marker"></i>
                <a href="https://www.google.com.tw/maps/place/110台北市信義區信義路五段7號" target="_blank"> 台北市信義區信義路五段7號 </a>
              </li>
              <li class="phone d-flex">
                <i class="fa fa-phone"></i>
                <a href="tel:02-12345678">02-12345678</a>
              </li>
              <li class="email d-flex">
                <i class="fa fa-envelope" aria-hidden="true"></i>
                <a href="mailto:info@yoursite.com">info@yoursite.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <div class="contact-form animate__animated"
            v-waypoint="{ active: true, callback: onWaypointList }">
            <h3>聯絡我們</h3>
            <ValidationObserver ref="observer" v-slot="{handleSubmit}">
              <form @submit.prevent="handleSubmit(submitHandler)">
                <div class="form-row form-group">
                  <ValidationProvider class="col-md-6 mb-3 mb-md-0"
                    rules="required" v-slot="{ errors, classes }">
                    <label for="fname">名字</label>
                    <input type="text" id="fname" name="名字" class="form-control"
                      v-model="form.firstName"
                      :class="classes" placeholder="請輸入 名字">
                    <span class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider class="col-md-6"
                    rules="required" v-slot="{ errors, classes }">
                    <label for="lname">姓氏</label>
                    <input type="text" id="lname" name="姓氏" class="form-control"
                      v-model="form.lastName"
                      :class="classes" placeholder="請輸入 姓氏">
                    <span class="invalid-feedback">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <ValidationProvider rules="required|email" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="email">信箱</label>
                    <input type="email" id="email" name="信箱" class="form-control"
                      v-model="form.email"
                      :class="classes" placeholder="請輸入 Email">
                    <span class="invalid-feedback">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="subject">主旨</label>
                    <input type="text" id="subject" name="主旨" class="form-control"
                      v-model="form.subject"
                      :class="classes" placeholder="請輸入 主旨">
                    <span class="invalid-feedback">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
                <ValidationProvider rules="required" v-slot="{ errors, classes }">
                  <div class="form-group">
                    <label for="message">留言</label>
                    <textarea id="message" name="留言" cols="30" rows="10"
                      v-model="form.message"
                      class="form-control" :class="classes">
                    </textarea>
                    <span class="invalid-feedback">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
                <button type="submit" class="btn">
                  <a ref="mailBtn" target="_blank">送出訊息</a>
                </button>
              </form>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.041578931471!2d121.56507676601251!3d25.032662983973047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xacc4d11dc963103c!2z5Y-w5YyXMTAx!5e0!3m2!1szh-TW!2stw!4v1616660178285!5m2!1szh-TW!2stw" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      },
    };
  },
  methods: {
    submitHandler() {
      const to = 'info@yoursite.com';
      const mail = `${this.form.message}%0A%0A%0A From：${this.form.lastName + this.form.firstName}%0A Email：${this.form.email}%0A`;
      this.$refs.mailBtn.href = `mailto:${to}?subject=${this.form.subject}&body=${mail}`;
      this.$refs.mailBtn.click();
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      };
      this.$refs.observer.reset();
      this.$refs.mailBtn.removeAttribute('href');
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
  mounted() {
    this.$bus.$emit('hideOffCanvas');
  },
};
</script>

<style lang="scss">
.contact-page{
  .banner{
    background: url(../../assets/images/ContactBanner.jpg) center;
    background-size: cover;
  }
}
.contact-info{
  margin-bottom: 50px;
  ul{
    padding-left: 0;
    margin-bottom: 0;
  }
  h3{
    font-size: 24px;
    margin-bottom: 30px;
  }
  li{
    margin-bottom: 20px;
    a{
      letter-spacing: 1px;
      &:hover{
        color: #00cdac;
        text-decoration: none;
      }
    }
    i{
      width: 24px;
      margin-right: 10px;
      font-size: 24px;
      color: #00d2ff;
      &.fa-map-marker{
        position: relative;
        top: -5px;
      }
      &.fa-phone{
        position: relative;
        top: -3px;
      }
      &.fa-envelope{
        position: relative;
        top: -5px;
      }
    }
    a{
      color: #828282;
    }
  }
}
.contact-form{
  h3{
    font-size: 24px;
    margin-bottom: 30px;
  }
  .form-control {
    height: 54px;
    font-size: 18px;
    border: 2px solid;
    border-image: linear-gradient(135deg, #00d2ff 0%, #00cdac 100%);
    border-image-slice: 1;
  }
  label{
    margin-bottom: 10px;
    font-weight: bold;
  }
  textarea.form-control{
    height: auto;
  }
  .btn{
    letter-spacing: 1px;
    display: block;
    height: 54px;
    margin: 20px 0 0 auto;
  }
  .invalid-feedback{
    display: block;
    visibility: hidden;
    height: 12px;
  }
  .is-invalid ~ .invalid-feedback{
    visibility: visible;
  }
}
@media(max-width: 768px){
  .contact-info{
    li{
      a:hover{
        color: #828282;
      }
    }
  }
}
</style>
