<template>
  <div class="dialog" v-if="project">
    <h2 class="dialog-title">{{ project.name }}</h2>
    <div class="dialog-content">
      <div v-html="project.htmlDescription"></div>
      <div class="dialog-bottom">
        <button type="button" class="dialog-close-button" @click="goBack">Back</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import gameProjectsData from "@/data/GameProjectsData.ts";
import otherProjectsData from "@/data/OtherProjectsData.ts";
import ProjectData from "@/data/ProjectData.ts";

export default Vue.extend({
  name: "ProjectDetails",
  computed: {
    project(): ProjectData | undefined {
      const allProjects: ProjectData[] = gameProjectsData.concat(otherProjectsData);
      return allProjects.find((p: ProjectData) => p.id === this.$route.params.id);
    },
  },
  created: function () {
    if (!this.project) {
      this.$router.replace("/404");
    }
  },
  mounted: function () {
    document.addEventListener("keydown", this.onKeydown);
  },
  beforeDestroy: function () {
    document.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    goBack: function () {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/game-projects");
      }
    },
    onKeydown: function (event: KeyboardEvent) {
      if (event.key === "Escape") {
        this.goBack();
      }
    },
  },
});
</script>

<style scoped>
.dialog {
  color: white;
  background-color: #000000;
  max-width: 1000px;
  margin: 0 auto;
}

iframe {
  width: 100%;
}

h2.dialog-title {
    text-align: center;
    font-size: 1.3em;
    margin: 0px;
    padding: 22px;
    color: #ffffff;
    background-color: #000000;
    line-height: 1.1em;
}

.dialog-content {
  padding: 20px;
}

.dialog-content {
  background: linear-gradient(180deg, #000000 0%, #120818 45%, #2b123f 100%);
  color: #ffffff;
}

.dialog-bottom {
  text-align: center;
  margin-top: 24px;
}

.dialog-close-button {
  cursor:pointer;
  font-size: 1.4em;
  display: inline-block;
  margin: 0 auto;
  color: #ffffff;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  line-height: inherit;
  opacity: 0.5;
}
.dialog-close-button:hover {
  opacity: 1;
}

@media only screen and (min-width: 620px){
  h2.dialog-title {
    font-size: 1.6em;
  }

  .dialog-content {
    padding: 40px;
  }
}

</style>
