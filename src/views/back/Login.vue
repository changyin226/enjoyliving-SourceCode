<template>
  <div class="login-page">
    <h1>EnjoyLiving後台</h1>
    <div class="form-signin">
      <form @submit.prevent="signin">
        <h2 class="h3 mb-3 font-weight-normal text-center">
          請先登入
        </h2>
        <label
          for="inputEmail"
          class="mb-2"
        >Email address</label>
        <input
          id="inputEmail"
          v-model="user.username"
          type="email"
          class="form-control"
          placeholder="Email address"
        >
        <label
          for="inputPassword"
          class="mb-2"
        >Password</label>
        <input
          id="inputPassword"
          v-model="user.password"
          type="password"
          class="form-control"
          placeholder="Password"
        >
        <div class="checkbox mb-3">
          <label>
            <input
              v-model="remember"
              type="checkbox"
            > Remember me
          </label>
        </div>
        <button
          class="btn btn-lg btn-primary btn-block"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import CryptoJS from 'crypto-js';

const key = process.env.VUE_APP_KEY;

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      remember: false,
    };
  },
  created() {
    this.getCookie();
    document.body.classList.remove('no-scroll');
  },
  methods: {
    signin() {
      this.$bus.$emit('update:loading', true);
      const api = `${process.env.VUE_APP_APIPATH}/admin/signin`;
      this.$http.post(api, this.user).then((response) => {
        if (response.data.success) {
          const { token, expired } = response.data;
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
          this.storeInfo(this.user.username, this.user.password);
          this.$bus.$emit('message:push', response.data.message, 'primary');
          this.$router.replace('/admin/products/1');
        } else {
          this.$bus.$emit('update:loading', false);
          this.$bus.$emit('message:push', response.data.message);
        }
      });
    },
    storeInfo(username, pwd) {
      if (this.remember) {
        const base64Pwd = Base64.encode(pwd);
        const cryptoJsPwd = CryptoJS.AES.encrypt(base64Pwd, key).toString();
        this.setCookie(username, cryptoJsPwd, 5);
      } else {
        this.clearCookie();
      }
    },
    setCookie(name, pwd, exdays) {
      const exdate = new Date();
      exdate.setTime(exdate.getTime() + (24 * 60 * 60 * 1000 * exdays));
      document.cookie = `username=${name};path=/;expires=${exdate.toGMTString()}`;
      document.cookie = `password=${pwd};path=/;expires=${exdate.toGMTString()}`;
    },
    getCookie() {
      if (document.cookie.includes('username') && document.cookie.includes('password')) {
        this.remember = true;
        const arr = document.cookie.split('; ');
        for (let i = 0; i < arr.length; i += 1) {
          const arr2 = arr[i].split('=');
          if (arr2[0] === 'username') {
            const username = arr2[1];
            this.user.username = username;
          } else if (arr2[0] === 'password') {
            const bytes = CryptoJS.AES.decrypt(arr2[1], key);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            const pwd = Base64.decode(originalText);
            this.user.password = pwd;
          }
        }
      }
    },
    clearCookie() {
      this.setCookie('', '', -1);
    },
  },
};
</script>

<style lang="scss">
.login-page{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 44px;
    text-align: center;
    background: linear-gradient( 135deg,#00d2ff 0%,#00cdac 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .form-signin {
    color: #fff;
    width: 100%;
    max-width: 330px;
    margin: 0 auto;
    padding: 15px;
  }
  .form-signin .checkbox {
    font-weight: 400;
  }
  .form-signin .form-control {
    height: auto;
    padding: 10px;
    font-size: 18px;
  }
  .form-signin input{
    margin-bottom: 10px;
  }
  .btn{
    color: #fff;
  }
}
</style>
