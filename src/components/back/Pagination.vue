<template>
  <nav class="pagination-component">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{'disabled': !pagination.has_pre}">
        <router-link class="page-link"
          :to="{ params: { page: pagination.current_page - 1 }}">
          <span>&laquo;</span>
        </router-link>
      </li>
      <li class="page-item" v-for="page in pagination.total_pages" :key="page"
      :class="{'active': pagination.current_page === page}">
        <router-link class="page-link"
          :to="{ params: { page: page }}">
          {{ page }}
        </router-link>
      </li>
      <li class="page-item" :class="{'disabled': !pagination.has_next}">
        <router-link class="page-link"
          :to="{ params: { page: pagination.current_page + 1 }}">
          <span>&raquo;</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.pagination-component{
  .page-item .page-link {
    background: transparent;
  }
  .page-item.active .page-link {
    background: #00d2ff;
  }
  .page-link:focus {
    box-shadow: none;
  }
}
</style>
