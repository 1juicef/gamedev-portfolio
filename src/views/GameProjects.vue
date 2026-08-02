<template>
  <div class="journey-page">
    <div class="hero">
      <div class="hero-copy">
        <h1>Hello there!</h1>
        <div class="intro">
          Welcome to my slice of the internet!
        </div>

        <div class="intro">
          My name is Josef and I am a Game Developer student residing in Gothenburg, Sweden. I have a background in fashion, retail and have previously run a clothing brand for five years. I love Arkham Horror, dogs and working out (almost equally).
        </div>

        <div class="intro secondary">
          Here are some projects that I have made solo or in team:
        </div>
      </div>

      <div class="hero-photo">
        <img src="img/avatar.png" alt="Avatar of Josef" width="512" height="512" />
      </div>
    </div>

    <section class="wip-section" v-if="wipProject">
      <h2 class="wip-section-title">Work In Progress</h2>
      <div class="project-row wip-row project-row--reverse" :style="{ '--project-accent': wipProject.accentColor }">
        <div class="project-image-wrap">
          <button
            class="project-image-button"
            :aria-label="wipProject.name + ' details'"
            @click="showDetails(wipProject)"
          >
            <LazyVideoThumbnail :src="thumbVideos[wipProject.id]" :poster="thumbPosters[wipProject.id]" />
          </button>
        </div>

        <div class="project-copy">
          <div class="project-entry-header">
            <button class="project-title-link" @click="showDetails(wipProject)">
              {{ wipProject.name }}
            </button>
          </div>
          <p class="project-summary">{{ summaries[wipProject.id] }}</p>
          <button
            class="project-cue"
            :aria-label="'View details for ' + wipProject.name"
            @click="showDetails(wipProject)"
          >View Details</button>
        </div>
      </div>
    </section>

    <h2 class="previous-projects-title">Previous Projects</h2>
    <div class="project-timeline">
      <section
        v-for="project in timelineProjects"
        :key="project.id"
        class="project-row"
        :class="{ 'project-row--reverse': projectRows[project.id] === 'reverse' }"
        :style="{ '--project-accent': project.accentColor }"
      >
        <div class="project-image-wrap">
          <button
            class="project-image-button"
            :class="{ 'project-image--swing-space': project.id === 'swing-space' }"
            :aria-label="project.name + ' details'"
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
          <button
            class="project-cue"
            :aria-label="'View details for ' + project.name"
            @click="showDetails(project)"
          >View Details</button>
        </div>
      </section>
    </div>

    <section class="game-jams">
      <h2 class="game-jams-title">Game Jams</h2>
      <div class="game-jam-links">
        <a
          class="game-jam-link"
          href="https://juice-f.itch.io/the-eldritch-keeper"
          target="_blank"
          rel="noopener noreferrer"
        >The Eldritch Keeper</a>
        <a
          class="game-jam-link"
          href="https://superguardian.itch.io/mas-q"
          target="_blank"
          rel="noopener noreferrer"
        >Mas-Q</a>
      </div>
    </section>

    <ProjectDetailsOverlay
      :visible="showPopup"
      :title="popupTitle"
      :color="popupColor"
      :html-content="popupContent"
      @close="showPopup = false"
    />

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import LazyVideoThumbnail from "@/components/LazyVideoThumbnail.vue";
import ProjectDetailsOverlay from "@/components/ProjectDetailsOverlay.vue";
import gameProjectsData from "@/data/GameProjectsData.ts";
import ProjectData from "@/data/ProjectData.ts";

export default Vue.extend({
  name: "GameProjects",
  components: {
    LazyVideoThumbnail,
    ProjectDetailsOverlay,
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
        "cpp-sokoban": "img/projects/cpp-sokoban/currentprogress.mp4",
        "drag-rush": "img/projects/drag-rush/DragRushGif.mp4",
        dispater: "img/projects/dispater/DispaterGif.mp4",
        "floor-0": "img/projects/floor-0/Floor0gif1.mp4",
        "swing-space": "img/projects/swing-space/SwingSpaceVid-thumb.mp4",
      },
      thumbPosters: {
        "cpp-sokoban": "img/projects/cpp-sokoban/super-mario-icons-square-yellow-box-with-question-mark-illustration-thumbnail.jpg",
        "drag-rush": "img/projects/drag-rush/DragRushGif-poster.webp",
        dispater: "img/projects/dispater/DispaterGif-poster.webp",
        "floor-0": "img/projects/floor-0/Floor0gif1-poster.webp",
        "swing-space": "img/projects/swing-space/SwingSpaceVid-thumb-poster.webp",
      },
      summaries: {
        "cpp-sokoban": "A Sokoban puzzle game built from scratch in SDL3 + C++. Unfinished, but the most technically hands-on project here: a custom memory arena, data-oriented design, and a hot-reloadable game-logic DLL.",
        "drag-rush": "\"Are you dragging or are you rushing!?\" Drag Rush is a racing game where you need to stick to the beat. Swerve and shoot your way through the race-track and beat the first-place holder.",
        dispater: "Dig for your salvation in this narrative heavy experience. Lead the crew down an unexplored path and discover the truth behind its walls.",
        "floor-0": "You wake up in a house you don't remember setting your foot in. Can you find a way out before the horrors haunting this place find you?",
        "swing-space": "Swing yourself up through space by grappling planets, push your run farther, and chase the highscore.",
      },
      showPopup: false,
      popupTitle: "",
      popupColor: "#000000",
      popupContent: "",
    };
  },
  computed: {
    wipProject: function (): ProjectData | undefined {
      // Held back from the live page until the write-up is ready to publish.
      return undefined;
    },
    timelineProjects: function (): ProjectData[] {
      return this.projects.filter((p: ProjectData) => p.id !== "cpp-sokoban");
    },
  },
  mounted: function () {
    const projectId = this.$route.query.project;
    if (typeof projectId === "string") {
      const project = this.projects.find((p: ProjectData) => p.id === projectId);
      if (project) {
        window.scrollTo(0, 0);
        this.showDetails(project);
      }
    }
  },
  methods: {
    showDetails: function (item: ProjectData) {
      this.popupTitle = item.name;
      this.popupColor = item.accentColor;
      this.popupContent = item.htmlDescription;
      this.showPopup = true;
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

.wip-section {
  margin-bottom: 56px;
  padding-bottom: 32px;
  border-bottom: 2px solid rgba(224, 142, 50, 0.4);
}

.wip-section-title {
  margin: 0 0 24px;
  font-size: 1.3em;
  font-weight: 100;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #e08e32;
}

.wip-row {
  padding: 0;
  border-top: none;
}

.previous-projects-title {
  margin: 0 0 24px;
  font-size: 1.3em;
  font-weight: 100;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.85;
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.14s ease, box-shadow 0.14s ease;
}

.project-image-button:active {
  transform: scale(0.985);
  box-shadow: 0 0 0 2px #6c3baa;
  box-shadow: 0 0 0 2px var(--project-accent, #6c3baa);
}

.project-image-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #6c3baa;
  box-shadow: 0 0 0 2px var(--project-accent, #6c3baa);
}

.project-image--swing-space {
  max-width: 46%;
  margin: 0 auto;
}

.project-cue {
  display: inline-block;
  margin: 20px 0 0;
  padding: 0;
  min-height: 44px;
  box-sizing: border-box;
  white-space: nowrap;
  background: none;
  border: 0;
  font-family: 'Lekton', Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 0.95em;
  line-height: 44px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #ffffff;
  border-bottom: 2px solid #6c3baa;
  border-bottom-color: var(--project-accent, #6c3baa);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.14s ease, border-bottom-color 0.14s ease;
}

.project-cue:active {
  color: #6c3baa;
  color: var(--project-accent, #6c3baa);
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
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.18s ease, opacity 0.18s ease, border-bottom-color 0.18s ease;
}

.project-title-link:hover,
.project-title-link:focus-visible {
  color: #f4cde6;
  opacity: 1;
  border-bottom-color: #f4cde6;
}

.project-title-link:active {
  border-bottom-color: #6c3baa;
  border-bottom-color: var(--project-accent, #6c3baa);
}

.project-summary {
  margin: 16px 0 0;
  max-width: 760px;
  font-size: 1.08em;
  line-height: 1.7;
}

.game-jams {
  margin-top: 8px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.game-jams-title {
  margin: 0 0 16px;
  font-size: 1.4em;
  font-weight: 100;
}

.game-jam-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-jam-link {
  color: inherit;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  padding-bottom: 2px;
  text-decoration: none;
  width: fit-content;
  transition: color 0.18s ease, border-bottom-color 0.18s ease;
}

.game-jam-link:hover,
.game-jam-link:focus-visible {
  color: #f4cde6;
  border-bottom-color: #f4cde6;
}

@media only screen and (min-width: 620px) {
  .game-jam-links {
    flex-direction: row;
    gap: 32px;
  }

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

@media (hover: hover) and (pointer: fine) {
  .project-image-button:hover {
    transform: scale(1.015);
  }

  .project-cue:hover {
    color: #6c3baa;
    color: var(--project-accent, #6c3baa);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-image-button {
    transition: box-shadow 0.14s ease;
  }

  .project-image-button:active,
  .project-image-button:hover {
    transform: none;
  }
}
</style>
