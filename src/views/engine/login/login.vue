<template>
  <div class="login">
    <div class="login-form">
      <Form :model="loginForm" :label-width="0" :rules="loginRule" ref="loginForm">
        <label class="title">运费模版</label>
        <FormItem prop="userName">
          <Input icon="person" v-model="loginForm.userName" ref="loginFocus" size="large" class="username" autofocus placeholder="请输入用户名" ></Input>
        </FormItem>
        <FormItem prop="password">
          <Input icon="locked" v-model="loginForm.password" placeholder="请输入密码"  type="password" size="large" class="password"  @keyup.enter.native="login" ></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" long @click="login">登录</Button>
        </FormItem>
      </Form>
    </div>
    <div class="copyright">版权所有Copyright&copy;深圳市abin科技有限公司</div>
  </div>
</template>

<script>
import './login.less'

export default {
  name: 'login-name',
  components: {
  },
  data() {
    return {
      loginRule: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      },
      loginForm: {
        userName: '',
        password: ''
      }
    }
  },
  mounted() {
    /* this.$refs['loginFocus'].focus() */
  },
  methods: {
    login() {
      const _this = this
      _this.$refs.loginForm.validate(valid => {
        if (valid) {
          _this.$store.dispatch('handleLogin', _this.loginForm).then(function(res) {
            // console.log(res)
            localStorage.clear()

            // 设置用户信息
            _this.$store.dispatch('getUserInfo', res)
            // 获取用户菜单权限
            _this.$store.dispatch('getUserPermission', res)
            setTimeout(function() { _this.$router.push({ name: 'home' }) }, 80)
          }).catch(function(err) {
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
