<template>
  <div id="app">
    <Header />
    <div class="main">
      <transition name="fade" mode="out-in">
        <router-view/>
      </transition>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Helpers from './helpers';

Helpers.preloadImages([
  "img/projects/drag-rush/DragRushGif-poster.webp",
  "img/projects/dispater/DispaterGif-poster.webp",
  "img/projects/floor-0/Floor0gif1-poster.webp",
  "img/projects/swing-space/SwingSpaceVid-thumb-poster.webp",
]);

export default Vue.extend({
  name: 'App',
  components: {
    Header, Footer
  }
});

</script>

<style lang="less">

@import './css/projects.less';
@import './css/variables.less';

@font-face {
  font-family: 'Lekton';
  src: url('/fonts/Lekton,Russo_One/Lekton/Lekton-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lekton';
  src: url('/fonts/Lekton,Russo_One/Lekton/Lekton-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Lekton';
  src: url('/fonts/Lekton,Russo_One/Lekton/Lekton-Italic.ttf') format('truetype');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'Russo One';
  src: url('/fonts/Lekton,Russo_One/Russo_One/RussoOne-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

html, body {
  margin: 0px;
  min-height: 100%;
  background: linear-gradient(to bottom left, #050608 0%, #081b1c 45%, #0c3230 75%, #12524c 100%);
  background-attachment: fixed;
}

#app {
  min-height: 100vh;
  background: transparent;
  color: @textColor;

  font-family: 'Lekton', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  font-size: 1.1em;
  line-height: 1.6em;
  text-align: justify;
}

h1, h2, h3, h4, h5,
.header,
.footer,
.project-title-link,
.nav-bar a {
  font-family: 'Russo One', 'Lekton', Helvetica, Arial, sans-serif;
}

h1, h2, h3, h4, h5 {
  text-align: left;
}

a {
  color: @textColor;
  text-decoration: none;
  opacity: 0.5;
}
a:hover, .router-link-exact-active {
  opacity: 1;
}

a:focus-visible, button:focus-visible {
  opacity: 1;
  outline: 2px solid lighten(@accentColor, 25%);
  outline-offset: 3px;
}

h1 {
  font-size: 2.5em;
  font-weight: 100;
  margin-top: -10px;
  margin-bottom: 40px;
  margin-left: -2px; // hack to make it "seem" more aligned with smaller text content
  line-height: 1.1em;
}

.main {
  padding: 16px 20px 40px;
}

@media only screen and (min-width: 620px){

  #app {
    text-align: left;
    line-height: 1.8em;
  }

  h1 {
    margin-top: 0.67em;
    margin-bottom: 80px;
    line-height: 0.7em;
  }

  .main {
    padding: 0 48px 40px;
  }

  .main, .footer {
    max-width: 1600px;
    margin: 0 auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>
