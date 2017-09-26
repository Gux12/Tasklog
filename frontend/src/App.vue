<template>
  <div class="app">
    <mt-header :title="`${$store.getters['user/isAuthed']?$store.state.user.user.username+'\'s':''} TaskLog`"
               :fixed="true" class="app_header">
      <router-link to="/log" slot="left">
        <mt-button><img src="../src/assets/tasklog.svg" height="30" width="30" slot="icon"></mt-button>
      </router-link>
      <mt-button slot='right' @click="logout" v-show="$store.getters['user/isAuthed']">退出</mt-button>
    </mt-header>
    <mt-navbar :value="url" class="app_navbar" v-show="$store.getters['user/isAuthed']">
      <mt-tab-item v-for="(path,index) in paths" :id="path.path.split('/')[1]" :key="index"
                   @click.native="$router.push(path.path)">
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
  .app_header {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
    z-index: 3;
  }

  .app_navbar {
    top: 48px;
    right: 0;
    left: 0;
    position: fixed;
    z-index: 2;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
  }

  .router_view {
    top: 84px;
    bottom: 0px;
    width: 100%;
    position: absolute;
    &.full {
      top: 48px;
    }
  }
</style>
