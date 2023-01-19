<template>
  <div class="login">
    <h1>This is an login page</h1>
    <h2>{{ this.$store.state.num}}</h2>
    <h2>{{ num1}}</h2>
    <Button type="info" @click="fn1">num++</Button>
    <Button type="success" @click="fn2">num--</Button>
    <br>
    <Button type="info" @click="()=>{this.$router.go(-1)}">主页</Button>
    <br>
    <login></login>
  </div>
</template>

<script>
import login from './login.vue'
export default {
  name: 'loginV',
  components: {
    login
  },
  data() {
    return {
      num1: this.$store.state.num
    }
  },
  methods: {
    fn1() {
      this.num1++
      this.$store.commit('setUserNames')
    },
    fn2() {
      this.num1--
      this.$store.commit('setUserNames', '--')
    }
  }
}
</script>
<style scoped>
.login{
  height: 100vh;
}
</style>
