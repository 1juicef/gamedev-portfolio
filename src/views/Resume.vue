<template>
  <div>
    <h1>Resume</h1>

    <div class="paragraph">
      <h1>JOSEF UBAKA</h1>
      <h2>Game Programmer</h2>

      <div class="contact">
        <div>+46 79-203 03 82</div>
        <div>josefubaka@gmail.com</div>
        <div>Amandas Gård 13, 414 83, Gothenburg Sweden</div>
      </div>

      <div class="paragraph">
        <strong>Profile</strong>
        <p>
          I am a reliable and well-organized person who works effectively both independently and as part of a team. With a calm and clear approach, I contribute to a positive and supportive working environment. I handle change and pressure well, follow routines carefully, and take responsibility for completing tasks in a professional manner.
        </p>
      </div>

      <div style="margin-top:20px; margin-bottom:20px;">
        <a class="download-link" href="d/resume-en.pdf" target="_blank"><i class="fa fa-download fa-lg fa-fw"></i> Download as PDF</a>
        <div style="clear:both"></div>
      </div>
    </div>
    <div class="photo">
      <img src="img/resume-pic.jpg" alt="Photo of Josef" />
    </div>

    <div style="clear:both"></div>

    <div class="full-content">
      <h2>Professional Experience</h2>

      <h3>Own Company - WET DOG</h3>
      <h4>2019 - 2024</h4>
      <div>Co-Founder
        <ul>
          <li>Founded and developed my own clothing and production business over five years.</li>
          <li>Responsible for planning, structure, financial management, and external partnerships.</li>
          <li>Worked extensively with long-term planning and strategy; strong experience in problem-solving, decision-making, and meeting deadlines.</li>
        </ul>
      </div>

      <h3>Axel Arigato</h3>
      <h4>2018 - Currently</h4>
      <div>Sales Representative / Assistant Store Manager
        <ul>
          <li>Worked full-time in a retail environment with a high level of responsibility and a fast-paced workflow.</li>
          <li>Experienced in customer service and professional communication. Responsible for daily operations, maintaining structure and organization.</li>
          <li>Experienced in tracking KPIs and working actively toward performance targets.</li>
        </ul>
      </div>

      <h3>Volvo Personvagnar AB</h3>
      <h4>2014 - 2016</h4>
      <div>Assembler
        <ul>
          <li>Worked in a fast-paced production environment with strict safety and quality standards.</li>
          <li>Strong focus on “team before self”.</li>
          <li>Gained experience in following routines and working in a structured way under time pressure.</li>
        </ul>
      </div>

      <h2>Education</h2>

      <h3>YRGO</h3>
      <h4>Game Programming (2025 - 2027)</h4>

      <h3>NORDISKA TEXTILAKADEMIN</h3>
      <h4>Textile Buyer (2019 - 2022)</h4>

      <h3>MUNKEBÄCKSGYMNASIET</h3>
      <h4>Social Science & Media (2013 - 2016)</h4>

      <h2>Skills</h2>

      <div class="skill-set">
        <h3>Hard Skills</h3>
        <ul>
          <li>Unity / C#</li>
          <li>Unreal Engine / C++</li>
          <li>SDL</li>
          <li>Driver’s License (B)</li>
        </ul>
      </div>

      <div class="skill-set">
        <h3>Soft Skills</h3>
        <ul>
          <li>Problem-solving</li>
          <li>Structure & planning</li>
          <li>Time management & prioritization</li>
        </ul>
      </div>

      <h2>Languages</h2>
      <ul>
        <li>Swedish (Native Language)</li>
        <li>English (Fluently)</li>
      </ul>

      <h2>References</h2>
      <ul>
        <li>Robert Esbjörnsson — Teacher & mentor @ Yrgo</li>
        <li>Samir Zdralic — Storemanager @ Axel Arigato (+46 76-890 78 31)</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Resume",
});
</script>

<style scoped>
h2 {
  font-weight: 100;
  font-size: 2em;
  margin: 0px;
  padding: 0px;
  padding-top: 50px;
}
h3 {
  font-weight: 100;
  font-size: 1.6em;
  margin: 0px;
  padding: 0px;
  padding-top: 30px;
}
h4 {
  font-weight: 100;
  font-size: 1.3em;
  margin: 0px;
  padding: 0px;
  padding-top: 15px;
  font-style: italic;
}

.paragraph {
  max-width: 700px;
}

.download-link {
  float:left;
  margin-right: 50px;
}

.full-content div {
  max-width: 800px;
}

.skill-set h3 {
  padding-bottom: 10px;
}

.photo img {
  height: 300px;
  width: 300px;
}

.tech-stack {
  font-style: italic;
}

.photo {
  margin-top: 50px;
  text-align: center;
}

@media only screen and (min-width: 620px){
  .paragraph {
    float: left;
  }

  .photo {
    float: left;
    padding: 30px;
    padding-left: 80px;
  }

  .skill-set {
    float: left;
    padding-right: 60px; 
  }
}
</style>