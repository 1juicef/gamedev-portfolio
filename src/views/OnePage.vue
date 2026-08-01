<template>
  <div class="one-page">
    <section id="projects" class="one-page-section">
      <GameProjects />
    </section>
    <section id="other-stuff" class="one-page-section">
      <OtherStuff />
    </section>
    <section id="resume" class="one-page-section">
      <Resume />
    </section>
    <section id="contact" class="one-page-section">
      <Contact />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameProjects from "@/views/GameProjects.vue";
import OtherStuff from "@/views/OtherStuff.vue";
import Resume from "@/views/Resume.vue";
import Contact from "@/views/Contact.vue";

export default Vue.extend({
  name: "OnePage",
  components: {
    GameProjects,
    OtherStuff,
    Resume,
    Contact,
  },
  mounted: function () {
    this.$root.$emit("one-page-sections-ready");
  },
});
</script>

<style scoped lang="less">
.one-page-section {
  scroll-margin-top: 88px;
}

.one-page-section + .one-page-section {
  margin-top: 56px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}
</style>
