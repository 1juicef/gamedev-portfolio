<template>
  <div class="footer">
    
    <div class="left"><a href="https://github.com/schouffy/gamedev-portfolio" target="_blank" rel="noopener noreferrer">Portfolio</a> by Juicef <img class="footer-guy" :src="mascotSrc" alt="Running character" /></div>
    <div class="right">Thanks for stopping by!</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Footer",
  computed: {
    mascotSrc(): string {
      switch (this.$route.path) {
        case "/game-projects":
          return "img/projects/Guy2.gif";
        case "/resume":
          return "img/projects/Guy3.gif";
        case "/contact":
          return "img/projects/Guy5.gif";
        default:
          return "img/projects/Guy2.gif";
      }
    }
  }
});
</script>

<style scoped lang="less">

@import '../css/variables.less';

.footer {
  background-color: transparent;
  width: 100%;
  font-size: 0.8em;
  opacity: 0.7;
  padding-bottom: 30px;
}

.left, .right {
    padding-top: 10px;
    text-align: center;
  }

.left {
  display: inline-flex;
  align-items: center;
}

.left a {
  margin-right: 4px;
}

.footer-guy {
  width: 20px;
  height: 20px;
  object-fit: contain;
  vertical-align: middle;
  margin-left: 6px;
  transform: translateY(-3px);
}

@media only screen and (max-width: 619px){

  .footer {
    padding-left: 40px;
    padding-right: 16px;
  }
}

@media only screen and (min-width: 620px){

  .footer {
    padding: 0;
  }

  .left, .right {
    padding: 20px;
  }

  .left {
    float: left;
    display: inline-flex;
    align-items: center;
  }

  .right {
    float:right;
  }
}
</style>