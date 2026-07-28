<template>
  <div>
    <h1>Other Stuff</h1>

    <div style="margin-bottom: 30px;">
      A grab bag of other things I've made outside of games — renders, patterns, and other bits.
    </div>

    <div class="other-stuff-grid">
      <div class="other-stuff-cell" v-for="item in media" :key="item.src">
        <img
          v-if="item.type === 'image'"
          class="other-stuff-media"
          loading="lazy"
          :src="item.src"
          :alt="item.alt"
        />
        <video
          v-else
          class="other-stuff-media"
          controls
          preload="metadata"
          :aria-label="item.alt"
        >
          <source :src="item.src" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "OtherStuff",
  data: function () {
    return {
      media: [
        { type: "video", src: "img/other-stuff/110001-0265.mp4", alt: "Animation render clip" },
        { type: "video", src: "img/other-stuff/Crouch%20walking1.mp4", alt: "Crouch walking animation" },
        { type: "image", src: "img/other-stuff/Dog%20jacket%20w%20buckle.png", alt: "Dog jacket with buckle" },
        { type: "image", src: "img/other-stuff/WDLog.jpg", alt: "WD logo" },
        { type: "image", src: "img/other-stuff/jeans%20boot%20cut%204.png", alt: "Jeans boot cut design" },
        { type: "video", src: "img/other-stuff/natiDraken.mp4", alt: "Nati Draken render clip" },
        { type: "image", src: "img/other-stuff/pattern%2008%20render.png", alt: "Pattern 08 render" },
      ],
    };
  },
});
</script>

<style scoped lang="less">
@import '../css/variables.less';

.other-stuff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.other-stuff-cell {
  aspect-ratio: 4 / 3;
  background-color: @contentBgColor;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.other-stuff-media {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

@media only screen and (max-width: 620px) {
  .other-stuff-grid {
    grid-template-columns: 1fr;
  }
}
</style>
