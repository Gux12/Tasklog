<template>
  <div class="app">
    <mt-header :title="`${$store.getters['user/isAuthed']?$store.state.user.user.username+'\'s':''} TaskLog`" :fixed="true">
      <router-link to="/log" slot="left">
        <mt-button><img src="../src/assets/logo.png" height="30" width="30" slot="icon"></mt-button>
      </router-link>
      <mt-button slot='right' @click="logout" v-show="$store.getters['user/isAuthed']">退出</mt-button>
    </mt-header>
    <mt-navbar :value="url" class="mt_navbar" v-show="$store.getters['user/isAuthed']">
      <mt-tab-item v-for="(path,index) in paths" :id="path.path.split('/')[1]" :key="index" @click.native="$router.push(path.path)">
        {{path.value}}
      </mt-tab-item>
    </mt-navbar>
    <router-view :class="['router_view',{'full':!$store.state.user.user}]"></router-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        paths: [
          {'path': '/task/active', 'value': '任务流'},
          {'path': '/log', 'value': '工作流'}
//          {'path': '/recycle/active', 'value': '回收站'}
        ]
      }
    },
    methods: {
      async logout () {
        await this.$store.dispatch('user/logout')
        this.$router.push('/login')
      }
    },
    computed: {
      url () {
        return this.$route.path.split('/')[1]
      }
    },
    created () {
    }
  }
</script>
<style lang="scss" scoped>
  .router_view {
    top: 84px;
    bottom: 0px;
    width: 100%;
    position: absolute;
    background-color: white;
    &.full {
      top: 48px;
    }
  }
</style>
