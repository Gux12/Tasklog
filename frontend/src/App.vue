<template>
  <div>
    <mt-header title="TaskLog" :fixed="true">
      <router-link to="/task/all" slot="left">
        <mt-button><img src="../src/assets/logo.png" height="30" width="30" slot="icon"></mt-button>
      </router-link>
      <mt-button slot='right' icon="more" @click="$router.go(0)"></mt-button>
    </mt-header>
    <mt-navbar v-model="selected" class="mt_navbar">
      <mt-tab-item v-for="(path,index) in paths" :id="path.path" :key="index" @click.native="$router.push(path.path)">
        {{path.value}}
      </mt-tab-item>
    </mt-navbar>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        paths: [
          {'path': '/task/all', 'value': '任务流'},
          {'path': '/log/all', 'value': '工作流'},
          {'path': '/recycle/all', 'value': '回收站'}
        ],
        selected: '/task'
      }
    },
    methods: {},
    created () {
      this.selected = this.$route.path
    }
  }
</script>
<style lang="scss">
  .mt_navbar {
    top: 48px;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 2;
  }
</style>
