<template>
  <nav class="pagination-component">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{disabled: currentPage - 1 === 0}">
        <router-link class="page-link"
          :to="{ params: { page: currentPage - 1 }}">
            <span>&laquo;</span>
        </router-link>
      </li>
      <li class="page-item" v-for="page in totalPage" :key="page"
        :class="{'active': currentPage === page}">
          <router-link class="page-link"
            :to="{ params: { page: page }}">
              {{ page }}
          </router-link>
      </li>
      <li class="page-item" :class="{disabled: currentPage === totalPage }">
        <router-link class="page-link"
          :to="{ params: { page: currentPage + 1 }}">
            <span>&raquo;</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPage: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.pagination-component{
  .page-link:focus {
    box-shadow: none;
  }
}
</style>
