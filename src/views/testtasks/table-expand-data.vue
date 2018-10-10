<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }
</style>
<template>
  <div>
    <Row class="expand-row">
      <i-col span="8">
        <span class="expand-key">项目名称：</span>
        <span class="expand-value">{{ row.projectName }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">开始时间：</span>
        <span class="expand-value">{{ row.startTime }}</span>
      </i-col>
      <i-col span="8">
        <span class="expand-key">结束时间：</span>
        <span class="expand-value">{{ row.finishTime }}</span>
      </i-col>

    </Row>
  </div>
</template>
<script>
  export default {
    props: {
      row: Object
    }
  }
</script>
