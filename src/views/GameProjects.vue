<template>
  <div class="journey-page">
    <div class="hero">
      <div class="hero-copy">
        <h1>Hello there!</h1>
        <div class="intro">
          Welcome to my slice of the internet!
        </div>

        <div class="intro">
          My name is Josef and I am a Game Developer student residing in Gothenburg, Sweden. I have a background in fashion, retail and have previously run a clothing brand for five years. I love Resident Evil, dogs and working out (almost equally).
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
          <button
            class="project-image-button"
            :class="{ 'project-image--swing-space': project.id === 'swing-space' }"
            @click="showDetails(project)"
          >
            <LazyVideoThumbnail :src="thumbVideos[project.id]" :poster="thumbPosters[project.id]" />
          </button>
        </div>

        <div class="project-copy">
          <div class="project-entry-header">
            <button class="project-title-link" @click="showDetails(project)">
              {{ project.name }}
            </button>
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
import LazyVideoThumbnail from "@/components/LazyVideoThumbnail.vue";
import gameProjectsData from "@/data/GameProjectsData.ts";
import ProjectData from "@/data/ProjectData.ts";

export default Vue.extend({
  name: "GameProjects",
  components: {
    ProjectDetailsOverlay,
    LazyVideoThumbnail,
  },
  data: function () {
    return {
      projects: gameProjectsData,
      projectRows: {
        "drag-rush": "normal",
        dispater: "reverse",
        "floor-0": "normal",
        "swing-space": "reverse",
      },
      thumbVideos: {
        "drag-rush": "img/projects/drag-rush/DragRushGif.mp4",
        dispater: "img/projects/dispater/DispaterGif.mp4",
        "floor-0": "img/projects/floor-0/Floor0gif1.mp4",
        "swing-space": "img/projects/swing-space/SwingSpaceGIF3.mp4",
      },
      thumbPosters: {
        "drag-rush": "img/projects/drag-rush/DragRushGif-poster.webp",
        dispater: "img/projects/dispater/DispaterGif-poster.webp",
        "floor-0": "img/projects/floor-0/Floor0gif1-poster.webp",
        "swing-space": "img/projects/swing-space/SwingSpaceGIF3-poster.webp",
      },
      showPopup: false,
      popupTitle: "",
      popupColor: "#000000",
      popupContent: "",
      summaries: {
        "drag-rush": "\"Are you dragging or are you rushing!?\" Drag Rush is a racing game where you need to stick to the beat. Swerve and shoot your way through the race-track and beat the first-place holder.",
        dispater: "Dig for your salvation in this narrative heavy experience. Lead the crew down an unexplored path and discover the truth behind its walls.",
        "floor-0": "You wake up in a house you don't remember setting your foot in. Can you find a way out before the horrors haunting this place find you?",
        "swing-space": "Swing yourself up through space by grappling planets, push your run farther, and chase the highscore.",
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
  margin-bottom: 56px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 56px;
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
  gap: 48px;
}

.project-row {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: stretch;
  padding: 32px 0;
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

.project-image--swing-space {
  max-width: 46%;
  margin: 0 auto;
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

.project-title-link {
  margin: 0;
  padding: 0;
  border: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: inherit;
  font-size: 2.1em;
  font-weight: 100;
  cursor: pointer;
  text-align: left;
  line-height: 1.1;
  transition: color 0.18s ease, opacity 0.18s ease, border-bottom-color 0.18s ease;
}

.project-title-link:hover,
.project-title-link:focus-visible {
  color: #f4cde6;
  opacity: 1;
  border-bottom-color: #f4cde6;
}

.project-summary {
  margin: 16px 0 0;
  max-width: 760px;
  font-size: 1.08em;
  line-height: 1.7;
}

@media only screen and (min-width: 620px) {
  .hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .hero-photo {
    flex: 0 0 240px;
    margin-top: 48px;
  }

  .project-row {
    flex-direction: row;
    align-items: center;
    gap: 48px;
    padding: 48px 0;
  }

  .project-row--reverse {
    flex-direction: row-reverse;
  }

  .project-image-wrap,
  .project-copy {
    flex: 1 1 0;
  }

  .project-image-wrap {
    flex-basis: 58%;
  }

  .project-copy {
    flex-basis: 42%;
  }

  .project-image--swing-space {
    max-width: 40%;
  }
}
</style>
