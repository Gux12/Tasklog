<template>
  <div class="login">
    <div class="login_form">
      <div class="login_form_input">
        <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="pwd"></mt-field>
      </div>
      <mt-button type="primary" size="large" @click="login">登录</mt-button>
    </div>
  </div>
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
          Indicator.close()
          Toast('登录成功！')
          this.$router.push('/log')
        } catch (e) {
          alert(e)
          Indicator.close()
          Toast(e.Message)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .login {
    background-color: #309990;
    .login_form {
      & :first-child {
        border-radius: 4px 4px 0 0;
      }
      & :last-child {
        border-radius: 0px 0px 4px 4px;
      }
      background-color: white;
      border-radius: 4px;
      margin: 60px auto auto 20px;
      width: calc(100% - 40px);
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.08), 0 2px 2px 0 rgba(0, 0, 0, 0.16);
      .login_form_input {
        padding: 10px;
      }
      button {
        background-color: rgba(#309990, .9);
      }
    }
  }
</style>
