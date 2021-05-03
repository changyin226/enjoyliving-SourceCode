<template>
  <div class="footer-component">
    <div class="news-letter py-5">
      <div class="container">
        <div class="row justify-content-center py-5">
          <div class="col-md-8">
            <div class="section-heading">
              <h2>訂閱電子報</h2>
              <p>立即訂閱，一手掌握所有最新產品！</p>
            </div>
          </div>
        </div>
        <div class="row justify-content-center pb-5">
          <div class="col-md-8">
            <form class="d-sm-flex" @submit.prevent>
              <input type="email" class="form-control mr-sm-3 mb-3 mb-sm-0"
              name="email" placeholder="Email">
              <button type="submit" class="btn btn-block">開始訂閱</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <footer class="py-4">
      <span>
        Copyright © 2021 All Rights Reserved
      </span>
      <ul class="d-flex justify-content-center pt-3 icon-list">
        <li class="px-2">
          <a href="#" target="_blank" @click.prevent>
            <i class="fa fa-twitter"></i>
          </a>
        </li>
        <li class="px-2">
          <a href="#" target="_blank" @click.prevent>
            <i class="fa fa-facebook-official"></i>
          </a>
        </li>
        <li class="px-2">
          <a href="#" target="_blank" @click.prevent>
            <i class="fa fa-linkedin-square"></i>
          </a>
        </li>
        <li class="px-2">
          <a href="#" target="_blank" @click.prevent>
            <i class="fa fa-dribbble"></i>
          </a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<style lang="scss">
.footer-component{
  .news-letter{
    background: linear-gradient(135deg, #00d2ff 0%, #00cdac 100%);
    .form-control{
      border: none;
      height: 54px;
      font-weight: 500;
    }
    .btn{
      height: 54px;
      border: none;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
    }
  }
  .section-heading{
    h2{
      font-size: 32px;
      color: #fff;
    }
    p{
      font-size: 20px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0;
    }
  }
  footer{
    text-align: center;
    span{
      color: #828282;
    }
  }
  .icon-list{
    list-style: none;
    margin-bottom: 0;
    padding-left: 0;
    a{
      font-size: 20px;
      color: #00cdac;
    }
  }
}
</style>
