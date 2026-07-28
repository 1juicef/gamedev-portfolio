<template>
  <div class="header">
    <div class="nav-bar">
      <img class="header-guy" :src="mascotSrc" alt="Running character" />
      <router-link to="/">Projects</router-link>
      <router-link to="/other-stuff">Other Stuff</router-link>
      <router-link to="/resume">Resume</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Header",
  //   props: {
  //     msg: String,
  //   },
  computed: {
    mascotSrc(): string {
      switch (this.$route.path) {
        case "/game-projects":
          return "img/projects/Guy.gif";
        case "/resume":
          return "img/projects/Guy1.gif";
        case "/contact":
          return "img/projects/Guy4.gif";
        default:
          return "img/projects/Guy.gif";
      }
    }
  }
});
</script>

<style scoped lang="less">

@import '../css/variables.less';

.header {
  width: 100%;
}

.nav-bar {
  text-align: right;
  padding: 20px;
  line-height: 3em;
}

.header-guy {
  width: 24px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 4px;
  transform: translateY(-5px);
}

a {
  text-transform: uppercase;
  margin-left: 15px;
  margin-right: 15px;
  padding-bottom: 8px;
  white-space: nowrap;
  display: inline-block;
}

.router-link-exact-active {
  border: 0px solid @textColor;
  border-bottom-width: 2px;
}

@media only screen and (max-width: 620px){
  .nav-bar {
    line-height: 2em;
  }

  a {
    margin-left: 9px;
    margin-right: 9px;
    padding-bottom: 0px;
  }

  .header-guy {
    width: 20px;
    height: 20px;
    margin-right: 3px;
    transform: translateY(-4px);
  }
}

</style>
