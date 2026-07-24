<template>
  <video
    ref="video"
    class="lazy-video-thumb"
    :poster="poster"
    autoplay
    muted
    loop
    playsinline
    preload="metadata"
  >
    <source :src="src" type="video/mp4" />
  </video>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LazyVideoThumbnail",
  props: {
    src: { type: String, required: true },
    poster: { type: String, required: true },
  },
  mounted: function () {
    // The declarative autoplay attribute isn't reliably honored on every
    // browser; explicitly calling play() covers those cases. The poster
    // attribute already shows a static frame if this never succeeds.
    const video = this.$refs.video as HTMLVideoElement | undefined;
    video?.play().catch(() => {
      // Autoplay blocked; the poster image remains visible instead.
    });
  },
});
</script>

<style scoped>
.lazy-video-thumb {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.14);
}
</style>
