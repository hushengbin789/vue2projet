<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button type="info" @click="()=>{this.$router.push({name: 'home'})}">主页</Button>
  </div>
</template>
