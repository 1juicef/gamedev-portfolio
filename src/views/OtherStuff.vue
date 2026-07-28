<template>
  <div>
    <h1>Other Stuff</h1>

    <div style="margin-bottom: 30px;">
      A grab bag of other things I've made outside of games — renders, patterns, and other bits.
    </div>

    <div v-for="item in media" :key="item.src">
      <img
        v-if="item.type === 'image'"
        loading="lazy"
        :src="item.src"
        :alt="item.alt"
      />
      <video
        v-else
        controls
        preload="metadata"
        :aria-label="item.alt"
      >
        <source :src="item.src" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
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
        { type: "image", src: "img/other-stuff/WDLog.jpg", alt: "WD logo" },
      ],
    };
  },
});
</script>
