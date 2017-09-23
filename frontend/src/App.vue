<template>
  <div>
    <mt-header :title="`${$store.state.user.user?$store.state.user.user.username+'\'s':''} TaskLog`" :fixed="true">
      <router-link to="/task/all" slot="left">
        <mt-button><img src="../src/assets/logo.png" height="30" width="30" slot="icon"></mt-button>
      </router-link>
      <mt-button slot='right' @click="logout">退出</mt-button>
    </mt-header>
    <mt-navbar v-model="selected" class="mt_navbar">
      <mt-tab-item v-for="(path,index) in paths" :id="path.path" :key="index" @click.native="$router.push(path.path)">
        {{path.value}}
      </mt-tab-item>
    </mt-navbar>
    <router-view class="router_view"></router-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        paths: [
          {'path': '/task/active', 'value': '任务流'},
          {'path': '/log/active', 'value': '工作流'},
          {'path': '/recycle/active', 'value': '回收站'}
        ],
        selected: '/task/active'
      }
    },
    methods: {
      async logout () {
        await this.$store.dispatch('user/logout')
        this.$router.push('/login')
      }
    },
    created () {
      this.selected = this.$route.path
    }
  }
</script>
<style lang="scss" scoped>
  .router_view {
    top: 84px;
    bottom: 0px;
    width: 100%;
    position: absolute;
  }
</style>
