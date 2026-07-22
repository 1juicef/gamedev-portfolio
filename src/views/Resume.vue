<template>
  <div class="resume-page">
    <img class="resume-image" src="img/actualResume.png" alt="Josef Ubaka resume" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Resume",
});
</script>

<style scoped>
.resume-page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.resume-image {
  width: 100%;
  height: auto;
  display: block;
  max-width: 1100px;
}

@media only screen and (min-width: 620px) {
  .resume-image {
    max-width: 1200px;
  }
}
</style>