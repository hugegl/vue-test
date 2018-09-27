<template>
  <div id="app">
    <!-- <router-view /> -->
    <!-- 缓存带有keepAlive -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!-- 给不需要被缓存的组件,一个新的出口-->
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
#app {
  height: 100%;
}
</style>
