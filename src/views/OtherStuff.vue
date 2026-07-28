<template>
  <div>
    <h1>Other Stuff</h1>

    <div style="margin-bottom: 30px;">
      Some things I made with CLO 3D and Blender during my days with WET DOG.
    </div>

    <div class="other-stuff-grid">
      <div class="other-stuff-cell" v-for="item in media" :key="item.src" :style="{ aspectRatio: item.width + ' / ' + item.height }">
        <img
          v-if="item.type === 'image'"
          class="other-stuff-media"
          loading="lazy"
          :src="item.src"
          :alt="item.alt"
        />
        <video
          v-else
          ref="video"
          class="other-stuff-media"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
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
        { type: "video", src: "img/other-stuff/110001-0265.mp4", alt: "Animation render clip", width: 1080, height: 1920 },
        { type: "video", src: "img/other-stuff/Crouch%20walking1.mp4", alt: "Crouch walking animation", width: 720, height: 1280 },
        { type: "image", src: "img/other-stuff/Dog%20jacket%20w%20buckle.png", alt: "Dog jacket with buckle", width: 900, height: 900 },
        { type: "image", src: "img/other-stuff/WDLog.jpg", alt: "WD logo", width: 2048, height: 1152 },
        { type: "image", src: "img/other-stuff/jeans%20boot%20cut%204.png", alt: "Jeans boot cut design", width: 900, height: 900 },
        { type: "video", src: "img/other-stuff/natiDraken.mp4", alt: "Nati Draken render clip", width: 606, height: 1050 },
        { type: "image", src: "img/other-stuff/pattern%2008%20render.png", alt: "Pattern 08 render", width: 2048, height: 2897 },
      ],
    };
  },
  mounted: function () {
    // These clips have no poster fallback frame, but the declarative autoplay
    // attribute isn't reliably honored on every browser; explicitly calling
    // play() covers those cases. Because ref is used inside a v-for, Vue
    // populates $refs.video as an array of elements rather than a single one.
    //
    // The block below is defensive/best-effort hardening around that known
    // unreliability, not a confirmed fix for a specific reproduced bug: a
    // reported intermittent gray-box failure could not be reproduced with the
    // tooling available while writing this, so load()/play() ordering and the
    // one-shot retry are reasoned from the existing pattern rather than a
    // captured root cause.
    const videos = this.$refs.video as HTMLVideoElement[] | undefined;
    if (!videos || videos.length === 0) {
      return;
    }
    videos.forEach((video) => {
      // Force a re-scan of the <source> child before the first play attempt,
      // guarding against the ref being populated before the source URL was
      // picked up.
      video.load();
      video.play().catch(() => {
        // Autoplay blocked; the first decoded frame remains visible instead.
      });
      // One-shot safety net: if the first play() was rejected because not
      // enough data had been buffered yet, retry once metadata is available.
      // { once: true } guarantees this never re-fires on loop or seek.
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.play().catch(() => {
            // Autoplay blocked; the first decoded frame remains visible instead.
          });
        },
        { once: true }
      );
    });
  },
});
</script>

<style scoped lang="less">
@import '../css/variables.less';

.other-stuff-grid {
  columns: 320px 3;
  column-gap: 16px;
  margin-top: 20px;
}

.other-stuff-cell {
  background-color: @contentBgColor;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  break-inside: avoid;
  margin-bottom: 16px;
}

.other-stuff-media {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

@media only screen and (max-width: 620px) {
  .other-stuff-grid {
    columns: 1;
  }
}
</style>
