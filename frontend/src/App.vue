<template>
  <div>
    <mt-header title="任务工作流" :fixed="true">
      <router-link to="/task/all" slot="left">
        <mt-button><img src="../src/assets/logo.png" height="40" width="40" slot="icon"></mt-button>
      </router-link>
      <mt-button icon="more" slot="right"></mt-button>
    </mt-header>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        selected: '1'
      }
    }
  }
</script>
<style lang="scss">
  body {
    margin: 0px;
  }
  * {
    box-sizing: border-box;
    -webkit-overflow-scrolling : touch;
  }
</style>
