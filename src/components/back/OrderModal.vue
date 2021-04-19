<template>
  <div class="modal fade" id="orderModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <h6 class="text-center py-3">購買日期： {{ order.create_at | timestamp }}</h6>
          <table class="table text-white">
            <tbody>
              <tr>
                <th width="100">訂單編號：</th>
                <td>{{ order.id }}</td>
              </tr>
              <tr>
                <th>Email：</th>
                <td>{{ order.user.email }}</td>
              </tr>
              <tr>
                <th>姓名：</th>
                <td>{{ order.user.name }}</td>
              </tr>
              <tr>
                <th>電話：</th>
                <td>{{ order.user.tel }}</td>
              </tr>
              <tr>
                <th>地址：</th>
                <td>{{ order.user.address }}</td>
              </tr>
              <tr>
                <th>留言：</th>
                <td>{{ order.message }}</td>
              </tr>
              <tr>
                <th>付款狀態：</th>
                <td>
                  <span v-if="!order.is_paid">尚未付款</span>
                  <span v-else class="text-success">付款完成</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>
