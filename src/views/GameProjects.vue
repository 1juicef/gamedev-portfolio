<template>
  <div class="journey-page">
    <div class="hero">
      <div class="hero-copy">
        <h1>Projects</h1>
        <div class="intro">
          Welcome to my slice of the internet!
        </div>

        <div class="intro">
          My name is Josef and I am a Game Developer student residing in Gothenburg, Sweden. I have a background in fashion, retail and have previously ran a clothing brand for five years. I love Resident Evil, dogs and working out (almost equally).
        </div>

        <div class="intro secondary">
          Here are some projects that I have made solo or in team:
        </div>
      </div>

      <div class="hero-photo">
        <img src="img/avatar.png" alt="Avatar of Josef" />
      </div>
    </div>

    <div class="project-timeline">
      <section
        v-for="project in projects"
        :key="project.id"
        class="project-row"
        :class="{ 'project-row--reverse': projectRows[project.id] === 'reverse' }"
      >
        <div class="project-image-wrap">
          <button class="project-image-button" @click="showDetails(project)" v-if="project.id !== 'drag-rush'">
            <img class="project-image" :src="project.iconUrl" :alt="project.name + ' image'" />
          </button>
          <div class="project-image-wrap-video" v-else>
            <iframe class="youtube" src="https://www.youtube.com/embed/L5YWz2i434E" frameborder="0" allowfullscreen></iframe>
          </div>
        </div>

        <div class="project-copy">
          <div class="project-entry-header">
            <h2>{{ project.name }}</h2>
            <button class="details-button" @click="showDetails(project)">Read more</button>
          </div>
          <p class="project-summary">{{ summaries[project.id] }}</p>
        </div>
      </section>
    </div>

    <ProjectDetailsOverlay
      v-on:close="showPopup = false"
      :visible="showPopup"
      :title="popupTitle"
      :htmlContent="popupContent"
      :color="popupColor"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectDetailsOverlay from "@/components/ProjectDetailsOverlay.vue";
import gameProjectsData from "@/data/GameProjectsData.ts";
import ProjectData from "@/data/ProjectData.ts";

export default Vue.extend({
  name: "GameProjects",
  components: {
    ProjectDetailsOverlay,
  },
  data: function () {
    return {
      projects: gameProjectsData,
      projectRows: {
        "drag-rush": "normal",
        dispater: "reverse",
        "floor-0": "normal",
      },
      showPopup: false,
      popupTitle: "",
      popupColor: "#000000",
      popupContent: "",
      summaries: {
        "drag-rush": "A rhythm-action racing game where you dodge obstacles and stay on beat. Available on itch.io.",
        dispater: "A sci-fi narrative game exploring a mysterious facility. Uncover secrets within its walls.",
        "floor-0": "An atmospheric exploration game set in an abandoned underground facility. Discover what happened here.",
      },
    };
  },
  methods: {
    showDetails: function (item: ProjectData) {
      this.popupTitle = item.name;
      this.popupColor = item.accentColor;
      this.popupContent = item.htmlDescription;
      this.showPopup = true;
      window.scrollTo(0, 0);
    },
  },
});
</script>

<style scoped>
.journey-page {
  margin-bottom: 40px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.hero-copy {
  max-width: 720px;
}

.intro {
  margin-bottom: 16px;
}

.intro.secondary {
  opacity: 0.85;
}

.hero-photo {
  text-align: left;
}

.hero-photo img {
  max-width: 220px;
  width: 100%;
  height: auto;
  display: block;
}

.project-timeline {
  display: grid;
  gap: 28px;
}

.project-row {
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: stretch;
  padding: 18px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.project-image-wrap {
  width: 100%;
}

.project-image-button {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.project-image-wrap-video {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.project-image-wrap-video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.project-image {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.project-copy {
  max-width: 760px;
}

.project-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.project-entry h2 {
  margin: 0;
  padding: 0;
  font-size: 1.8em;
  font-weight: 100;
}

.project-summary {
  margin: 10px 0 0;
  max-width: 760px;
}

.details-button {
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
  padding: 8px 14px;
  cursor: pointer;
  opacity: 0.8;
  white-space: nowrap;
}

.details-button:hover {
  opacity: 1;
}

@media only screen and (min-width: 620px) {
  .hero {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .hero-photo {
    flex: 0 0 240px;
  }

  .project-row {
    flex-direction: row;
    align-items: center;
    gap: 36px;
    padding: 28px 0;
  }

  .project-row--reverse {
    flex-direction: row-reverse;
  }

  .project-image-wrap,
  .project-copy {
    flex: 1 1 0;
  }
}
</style>
