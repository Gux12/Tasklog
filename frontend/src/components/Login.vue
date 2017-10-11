<template>
  <div class="login">
    <div class="login_form">
      <div class="login_form_input">
        <mt-field label="用户名" placeholder="请输入用户名" v-model="username"></mt-field>
        <mt-field label="密码" placeholder="请输入密码" type="password" v-model="pwd"></mt-field>
      </div>
      <mt-button type="primary" size="large" @click="login">登录</mt-button>
    </div>
    <section class="login_section">
    </section>
  </div>
</template>
<script>
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
        await this.$store.dispatch('user/login', {username, pwd})
        this.$router.push('/task/active/全部')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import 'src/scss/color.scss';

  .login {
    position: fixed;
    .login_section {
      background-color: $color-primary;
      height: 100%;
      position: relative;
    }
    .login_form {
      & :last-child {
        border-radius: 0px 0px 4px 4px;
      }
      background-color: white;
      border-radius: 4px;
      left: 1em;
      right: 1em;
      top: 5em;
      position: absolute;
      z-index: 1;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.10), 0 3px 2px 0 rgba(0, 0, 0, 0.16);
      .login_form_input {
        padding: 10px;
      }
      button {
        background-color: $color-button;
      }
    }
  }
</style>
