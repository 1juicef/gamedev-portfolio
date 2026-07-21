<template>
  <div ref="wrap" class="lazy-video-thumb">
    <video
      v-if="hasIntersected"
      ref="video"
      :poster="poster"
      preload="none"
      muted
      loop
      playsinline
      @loadeddata="onLoaded"
    >
      <source :src="src" type="video/mp4" />
    </video>
    <img
      v-else
      loading="lazy" :src="poster"
      class="lazy-video-thumb-poster"
      alt=""
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "LazyVideoThumbnail",
  props: {
    src: { type: String, required: true },
    poster: { type: String, required: true },
  },
  data: function () {
    return {
      hasIntersected: false,
      observer: null as IntersectionObserver | null,
    };
  },
  mounted: function () {
    // Fallback for environments without IntersectionObserver: show video immediately.
    if (typeof IntersectionObserver === "undefined") {
      this.hasIntersected = true;
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.hasIntersected = true;
            this.$nextTick(() => {
              const video = this.$refs.video as HTMLVideoElement | undefined;
              // play() returns a Promise that can reject (autoplay policy); ignore rejection.
              video?.play().catch(() => {
                // Autoplay was blocked by the browser; the poster remains visible via CSS fallback.
              });
            });
          } else if (this.$refs.video) {
            (this.$refs.video as HTMLVideoElement).pause();
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    this.observer.observe(this.$refs.wrap as Element);
  },
  beforeDestroy: function () {
    this.observer?.disconnect();
  },
  methods: {
    onLoaded: function () {
      // hook available if a loading-spinner state is added later; no-op for now
    },
  },
});
</script>

<style scoped>
.lazy-video-thumb {
  width: 100%;
}

.lazy-video-thumb video,
.lazy-video-thumb-poster {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.14);
}
</style>
