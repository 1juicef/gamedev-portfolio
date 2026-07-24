<template>
  <div ref="wrap" class="lazy-video-thumb">
    <video
      v-if="hasIntersected && !loadFailed"
      ref="video"
      :poster="poster"
      preload="none"
      muted
      loop
      playsinline
      @loadeddata="onLoaded"
      @error="onError"
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
      loadFailed: false,
      retried: false,
      observer: null as IntersectionObserver | null,
    };
  },
  mounted: function () {
    // Fallback for environments without IntersectionObserver: show video immediately.
    if (typeof IntersectionObserver === "undefined") {
      this.hasIntersected = true;
      return;
    }

    const wrap = this.$refs.wrap as HTMLElement;

    // Some mobile Chromium builds never fire an IntersectionObserver's first
    // callback for elements already inside the watch zone at observe()-time
    // (reported: thumbnails near the top of the page stay blank indefinitely
    // until an unrelated scroll event forces the browser to catch up). Do a
    // synchronous check up front so already-visible thumbnails don't depend
    // on that first callback at all.
    const rect = wrap.getBoundingClientRect();
    const margin = 600;
    if (rect.bottom >= -margin && rect.top <= window.innerHeight + margin) {
      this.activate();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activate();
          } else if (this.$refs.video) {
            (this.$refs.video as HTMLVideoElement).pause();
          }
        });
      },
      // Wide margin so a fast fling-scroll can't skip a card before the
      // browser gets a chance to compute an intermediate intersecting state.
      { rootMargin: "600px 0px" }
    );
    this.observer.observe(wrap);
  },
  beforeDestroy: function () {
    this.observer?.disconnect();
  },
  methods: {
    activate: function () {
      if (this.hasIntersected) return;
      this.hasIntersected = true;
      this.$nextTick(() => {
        const video = this.$refs.video as HTMLVideoElement | undefined;
        // play() returns a Promise that can reject (autoplay policy); ignore rejection.
        video?.play().catch(() => {
          // Autoplay was blocked by the browser; the poster remains visible via CSS fallback.
        });
      });
    },
    onLoaded: function () {
      // hook available if a loading-spinner state is added later; no-op for now
    },
    onError: function () {
      // A transient CDN/network hiccup shouldn't leave a permanently blank
      // thumbnail. Retry once after a short delay; if it fails again, fall
      // back to the (already-cached) poster image for good.
      if (this.retried) {
        this.loadFailed = true;
        return;
      }
      this.retried = true;
      setTimeout(() => {
        this.hasIntersected = false;
        this.$nextTick(() => this.activate());
      }, 1500);
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
