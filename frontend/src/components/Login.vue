<template>
  <form action="" class="login_form">
    <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="pwd"></mt-field>
    <mt-button type="primary" size="large" @click="login">登录</mt-button>
  </form>
</template>
<script>
  import { Toast, Indicator } from 'mint-ui'

  export default {
    data () {
      return {
        username: '',
        pwd: ''
      }
    },
    methods: {
      async login () {
        let {username, pwd} = this
        Indicator.open()
        try {
          await this.$store.dispatch('user/login', {username, pwd})
          this.$router.push('/task/active')
        } catch (e) {
          Indicator.close()
          Toast(e.Message)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .login_form {
    padding: 0 10px;
  }
</style>
