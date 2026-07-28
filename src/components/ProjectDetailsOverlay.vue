<template>
  <transition name="fade">
    <div v-if="visible">
      <div class="overlay">
      </div>
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <h2 id="dialog-title" class="dialog-title">{{ title }}</h2>
        <button type="button" class="dialog-close" aria-label="Close" @click="$emit('close')"><i class="fa fa-times fa-lg fa-fw"></i></button>
        <div class="dialog-content">
          <div v-html="htmlContent"></div>
          <div class="dialog-bottom">
          <button type="button" class="dialog-close-button" @click="$emit('close')">Close</button>
        </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ProjectDetailsOverlay",
  props: {
    visible: Boolean,
    color: String,
    title: String,
    htmlContent: String,
  },
  watch: {
    visible: function (isVisible: boolean) {
      if (isVisible) {
        document.addEventListener("keydown", this.onKeydown);
      } else {
        document.removeEventListener("keydown", this.onKeydown);
      }
    },
  },
  beforeDestroy: function () {
    document.removeEventListener("keydown", this.onKeydown);
  },
  methods: {
    onKeydown: function (event: KeyboardEvent) {
      if (event.key === "Escape") {
        this.$emit("close");
      }
    },
  },
});
</script>

<style scoped>
.overlay {
  background-color: rgba(0,0,0,0.5);
  z-index: 10;
  position: fixed;
  top:0px;
  left:0px;
  right:0px;
  bottom: 0px;
}

.dialog {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  z-index: 11;
  margin: 20px;
  color:white;
  background-color: #000000;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
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
.dialog-close {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor:pointer;
  font-size: 1.2em;
  font-weight: 100;
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-family: inherit;
  line-height: inherit;
}
.dialog-close:hover {
  opacity: 0.6;
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
  .dialog {
    margin: 0 auto;
    margin-top: 80px;
    margin-bottom: 40px;
    max-width: 1000px;
    max-height: calc(100vh - 120px);
  }

  h2.dialog-title {
    font-size: 1.6em;
  }

  .dialog-content {
    padding: 40px;
  }
}


</style>
