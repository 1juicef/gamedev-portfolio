<template>
  <div class="header">
    <div class="nav-bar">
      <img class="header-guy" :src="mascotSrc" alt="Running character" />
      <template v-if="isOnePage">
        <button
          v-for="link in sectionLinks"
          :key="link.id"
          type="button"
          class="nav-link"
          :class="{ 'nav-link--active': activeSection === link.id }"
          @click="scrollToSection(link.id)"
        >{{ link.label }}</button>
      </template>
      <template v-else>
        <router-link to="/">Projects</router-link>
        <router-link to="/other-stuff">Other Projects</router-link>
        <router-link to="/resume">Resume</router-link>
        <router-link to="/contact">Contact</router-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

// Section id -> mascot gif, on /one-page only. Reuses the exact images the
// route-based switch below already serves for each page.
const SECTION_MASCOTS: Record<string, string> = {
  projects: 'img/projects/Guy.gif',
  'other-stuff': 'img/projects/Guy7.gif',
  resume: 'img/projects/Guy1.gif',
  contact: 'img/projects/Guy4.gif',
};

export default Vue.extend({
  name: "Header",
  //   props: {
  //     msg: String,
  //   },
  data: function () {
    return {
      activeSection: 'projects',
      sectionLinks: [
        { id: 'projects', label: 'Projects' },
        { id: 'other-stuff', label: 'Other Projects' },
        { id: 'resume', label: 'Resume' },
        { id: 'contact', label: 'Contact' },
      ],
      observer: null as IntersectionObserver | null,
    };
  },
  computed: {
    isOnePage(): boolean {
      return this.$route.path === '/' || this.$route.path === '/one-page';
    },
    mascotSrc(): string {
      if (this.isOnePage) {
        return SECTION_MASCOTS[this.activeSection] || 'img/projects/Guy.gif';
      }
      switch (this.$route.path) {
        case "/game-projects":
          return "img/projects/Guy.gif";
        case "/resume":
          return "img/projects/Guy1.gif";
        case "/contact":
          return "img/projects/Guy4.gif";
        case "/other-projects":
          return "img/projects/Guy6.gif";
        case "/other-stuff":
          return "img/projects/Guy7.gif";
        default:
          return "img/projects/Guy.gif";
      }
    }
  },
  created: function () {
    this.$root.$on('one-page-sections-ready', this.setupSectionObserver);
  },
  beforeDestroy: function () {
    this.$root.$off('one-page-sections-ready', this.setupSectionObserver);
    this.teardownSectionObserver();
  },
  watch: {
    '$route.path': function (newPath: string) {
      if (newPath === '/' || newPath === '/one-page') {
        this.activeSection = 'projects';
        this.$nextTick(() => {
          this.setupSectionObserver();
        });
      } else {
        this.teardownSectionObserver();
      }
    },
  },
  methods: {
    scrollToSection: function (id: string) {
      const el = document.getElementById(id);
      if (!el) {
        return;
      }
      let reducedMotion = false;
      try {
        reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      } catch (e) {
        reducedMotion = false;
      }
      el.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
      this.activeSection = id;
    },
    setupSectionObserver: function () {
      this.teardownSectionObserver();
      if (!this.isOnePage || typeof IntersectionObserver === 'undefined') {
        return;
      }
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      }, {
        threshold: 0,
        rootMargin: '-45% 0px -45% 0px',
      });
      this.sectionLinks.forEach((link) => {
        const el = document.getElementById(link.id);
        if (el && this.observer) {
          this.observer.observe(el);
        }
      });
    },
    teardownSectionObserver: function () {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
  },
});
</script>

<style scoped lang="less">

@import '../css/variables.less';

.header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.15);
}

.nav-bar {
  text-align: right;
  padding: 20px;
  line-height: 3em;
}

.header-guy {
  width: 24px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 4px;
  transform: translateY(-5px);
}

a, .nav-link {
  text-transform: uppercase;
  margin-left: 15px;
  margin-right: 15px;
  padding-bottom: 8px;
  white-space: nowrap;
  display: inline-block;
}

.nav-link {
  font-family: 'Russo One', 'Lekton', Helvetica, Arial, sans-serif;
  font-size: inherit;
  line-height: inherit;
  vertical-align: baseline;
  color: @textColor;
  opacity: 0.5;
  background: none;
  border: 0;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.nav-link:hover {
  opacity: 1;
}

.router-link-exact-active,
.nav-link--active {
  border: 0px solid @textColor;
  border-bottom-width: 2px;
}

.nav-link--active {
  opacity: 1;
}

@media only screen and (min-width: 620px){
  .nav-bar {
    max-width: 1600px;
    margin: 0 auto;
  }
}

@media only screen and (max-width: 620px){
  .nav-bar {
    line-height: 2em;
    font-size: 0.8em;
    padding: 20px 28px 20px 12px;
  }

  a, .nav-link {
    margin-left: 7px;
    margin-right: 7px;
    padding-bottom: 0px;
  }

  .header-guy {
    width: 20px;
    height: 20px;
    margin-right: 3px;
    transform: translateY(-4px);
  }
}

</style>
