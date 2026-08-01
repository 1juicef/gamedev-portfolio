<template>
  <div class="resume-page">
    <header class="resume-header">
      <div class="resume-heading">
        <h1>Josef Ubaka</h1>
        <div class="resume-title">Game Programmer</div>
      </div>

      <a class="download-button" href="img/actualResume.png" download="Josef-Ubaka-Resume.png">
        <i class="fa fa-download fa-fw"></i> Download
      </a>
    </header>

    <ul class="contact-row">
      <li>
        <i class="fa fa-envelope-o fa-fw"></i>
        <a href="mailto:josefubaka@gmail.com">josefubaka@gmail.com</a>
      </li>
      <li>
        <i class="fa fa-phone fa-fw"></i>
        <a href="tel:+46792030382">+46 79-203 03 82</a>
      </li>
      <li>
        <i class="fa fa-map-marker fa-fw"></i>
        Gothenburg, Sweden
      </li>
    </ul>

    <blockquote class="summary">
      Creative and driven programming student doing the last term before I graduate as a Game Developer.
      I have a background in the fashion industry, having worked in retail stores and co-founded a brand.
      I enjoy working both independently and in teams, and thrive in both. I contribute to my work
      environment by being positive, calm, and having a clear approach.
    </blockquote>

    <section class="resume-section">
      <h2>Selected Projects</h2>
      <div class="project-entries">
        <article class="project-entry" v-for="project in projects" :key="project.id">
          <div class="project-entry-header">
            <router-link class="project-entry-link" :to="`/game-projects?project=${project.id}`">
              {{ project.name }}
            </router-link>
            <span class="project-meta">{{ project.meta }}</span>
          </div>
          <p class="project-entry-summary">{{ project.summary }}</p>
        </article>
      </div>
    </section>

    <div class="resume-columns">
      <section class="resume-section">
        <h2>Experience</h2>
        <article class="entry" v-for="job in experience" :key="job.org">
          <div class="entry-header">
            <span class="entry-org">{{ job.org }}</span>
            <span class="entry-period">{{ job.period }}</span>
          </div>
          <div class="entry-role">{{ job.role }}</div>
          <p class="entry-detail">{{ job.detail }}</p>
        </article>
      </section>

      <div class="resume-column-secondary">
        <section class="resume-section">
          <h2>Education</h2>
          <article class="entry" v-for="school in education" :key="school.org">
            <div class="entry-header">
              <span class="entry-org">{{ school.org }}</span>
              <span class="entry-period">{{ school.period }}</span>
            </div>
            <div class="entry-role">{{ school.role }}</div>
          </article>
        </section>

        <section class="resume-section">
          <h2>Tech &amp; Language</h2>
          <div class="tech-chips">
            <span class="tech-chip" v-for="tech in techStack" :key="tech">{{ tech }}</span>
          </div>
          <div class="languages">Swedish (native) &middot; English (fluent)</div>
        </section>
      </div>
    </div>

    <section class="resume-section">
      <h2>Beyond the Code</h2>
      <div class="personal-entries">
        <article class="personal-entry" v-for="item in personal" :key="item.label">
          <span class="personal-label">{{ item.label }}</span>
          <span class="personal-detail">{{ item.detail }}</span>
        </article>
      </div>
    </section>

    <footer class="resume-footer">
      <span>References available on request</span>
      <a href="https://www.josefubaka.com" target="_blank" rel="noopener noreferrer">www.josefubaka.com</a>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Resume",
  data: function () {
    return {
      projects: [
        {
          id: "drag-rush",
          name: "Drag Rush",
          meta: "Unity · C# · 8wk · team of 6",
          summary: "Built animation trees for the vehicles. Helped with overhauling our beat conductor for better BPM precision. Also did level design.",
        },
        {
          id: "dispater",
          name: "Dispater",
          meta: "Unreal · C++ · 8wk · team of 7",
          summary: "Built the systems that drive the story forward, including dialogue, voice lines, tasks, interactions.",
        },
        {
          id: "floor-0",
          name: "Floor Zero",
          meta: "Unreal · UE Blueprint · 5wk · solo",
          summary: "Made a modular interaction interface, together with a key/door system. Built a competent AI using UE's NavMesh.",
        },
        {
          id: "swing-space",
          name: "SwingSpace",
          meta: "Unity · C# · 5wk · solo",
          summary: "First solo project. Built a swing mechanic and hooked up a live global leaderboard with Firebase.",
        },
      ],
      experience: [
        {
          org: "Wet Dog",
          role: "Co-Founder",
          period: "2019-24",
          detail: "Ran an independent business for 5 years. Planning, budget, partnerships.",
        },
        {
          org: "Axel Arigato",
          role: "Sales / Assistant Manager",
          period: "2018-now",
          detail: "KPI-driven retail operations in a fast-paced environment.",
        },
      ],
      education: [
        {
          org: "YRGO",
          role: "Game Programming",
          period: "25-27",
        },
        {
          org: "Nordiska Textilakademin",
          role: "Textile Buyer",
          period: "19-22",
        },
      ],
      techStack: ["Unity", "C#", "Unreal", "C++", "UE Blueprint", "Git"],
      personal: [
        {
          label: "Esports",
          detail: "Top 500 in Overwatch, mainly playing Ana support.",
        },
        {
          label: "Current favorites",
          detail: "Zelda: A Link to the Past, RE9, TLOS 2, and Dead Cells.",
        },
        {
          label: "Anime",
          detail: "Fan since I was 8, when I found a Dragon Ball at my local library. Some of my favs: Gachiakuta, Chainsaw Man, and JoJo's.",
        },
        {
          label: "Off the PC",
          detail: "Running, or taking walks in the woods.",
        },
        {
          label: "Music",
          detail: "Sang, rapped, and produced with a group of friends throughout my teenage years. A part of my life that's close to my heart.",
        },
      ],
    };
  },
});
</script>

<style scoped lang="less">
@import '../css/variables.less';

.resume-page {
  max-width: 900px;
  margin: 0 auto;
}

.resume-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.resume-heading h1 {
  margin: 0 0 4px;
}

.resume-title {
  font-family: "Russo One", "Lekton", Helvetica, Arial, sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.7;
  font-size: 1em;
}

.download-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 10px 18px;
  border: 1px solid @accentColor;
  border-radius: 4px;
  background: rgba(108, 59, 170, 0.18);
  color: @textColor;
  opacity: 1;
  white-space: nowrap;
  transition: background 0.18s ease, border-color 0.18s ease;
}

.download-button:hover,
.download-button:focus-visible {
  background: @accentColor;
  border-color: @accentColor;
}

.contact-row {
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
}

.contact-row i {
  margin-right: 8px;
  opacity: 0.7;
}

.summary {
  margin: 32px 0 0;
  padding-left: 20px;
  border-left: 3px solid @accentColor;
  opacity: 0.9;
  font-style: italic;
}

.resume-section {
  margin-top: 48px;
}

.resume-section h2 {
  margin: 0 0 20px;
  font-size: 1.2em;
  font-weight: 100;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  padding-bottom: 12px;
}

.project-entries {
  display: grid;
  gap: 28px;
}

.project-entry-header,
.entry-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px 16px;
}

.project-entry-link {
  font-family: "Russo One", "Lekton", Helvetica, Arial, sans-serif;
  font-size: 1.3em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.35);
  transition: color 0.18s ease, opacity 0.18s ease, border-bottom-color 0.18s ease;
}

.project-entry-link:hover,
.project-entry-link:focus-visible {
  color: #f4cde6;
  opacity: 1;
  border-bottom-color: #f4cde6;
}

.project-meta {
  font-size: 0.85em;
  opacity: 0.6;
  white-space: nowrap;
}

.project-entry-summary {
  margin: 10px 0 0;
  opacity: 0.9;
}

.resume-columns {
  display: grid;
  gap: 0 64px;
}

.entry {
  margin-bottom: 24px;
}

.entry:last-child {
  margin-bottom: 0;
}

.entry-org {
  font-weight: 700;
}

.entry-period {
  font-size: 0.85em;
  opacity: 0.6;
  white-space: nowrap;
}

.entry-role {
  opacity: 0.75;
  margin-top: 2px;
}

.entry-detail {
  margin: 8px 0 0;
  opacity: 0.9;
}

.tech-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-chip {
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.9em;
}

.languages {
  margin-top: 16px;
  opacity: 0.75;
}

.personal-entries {
  display: grid;
  gap: 16px;
}

.personal-entry {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.personal-label {
  font-weight: 700;
  opacity: 0.85;
}

.personal-detail {
  opacity: 0.9;
}

@media only screen and (min-width: 620px) {
  .personal-entry {
    flex-direction: row;
    gap: 16px;
  }

  .personal-label {
    flex: 0 0 180px;
  }

  .personal-detail {
    flex: 1;
  }
}

.resume-footer {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  opacity: 0.7;
  font-size: 0.9em;
}

@media only screen and (min-width: 620px) {
  .resume-columns {
    grid-template-columns: 1.3fr 1fr;
  }
}
</style>
