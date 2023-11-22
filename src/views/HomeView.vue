<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/login">login</router-link> |
      <router-link to="/timeLiness">timeLiness</router-link> |
      <router-link to="/sync-log">sync-log</router-link>|
      <router-link to="/BI-logisticsOverview">BI-logisticsOverview</router-link>
    </nav>
    <Button type="info">Info</Button>
    <Button type="success">Success</Button>
    <Button type="warning">Warning</Button>
    <Button type="error">Error</Button>
    <HelloWorld msg="Welcome to Your Vue.js App"></HelloWorld>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  mounted() {
    this.$store.dispatch('getAllShippingmethodss')
  }
}
</script>
