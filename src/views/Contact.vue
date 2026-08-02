<template>
  <div class="contact-page">

    <h1>Contact</h1>

    <div style="margin-bottom:40px;">Feel free to reach out here:</div>

    <ul>
      <li>
        <i class="fa fa-linkedin fa-lg fa-fw" style="vertical-align: -5%;"></i>
        <a href="https://www.linkedin.com/in/josef-ubaka/" target="_blank" rel="noopener noreferrer">linkedin.com/in/josef-ubaka</a>
      </li>
      <li>
        <i class="fa fa-envelope-o fa-lg fa-fw"></i>
        <a href="mailto:josefubaka@gmail.com" target="_blank" rel="noopener noreferrer">josefubaka@gmail.com</a>
      </li>
      <li>
        <i class="fa fa-github fa-lg fa-fw"></i>
        <a href="https://github.com/1juicef" target="_blank" rel="noopener noreferrer">github.com/1juicef</a>
      </li>
      <li>
        <i class="fa fa-gamepad fa-lg fa-fw"></i>
        <a href="https://juice-f.itch.io/" target="_blank" rel="noopener noreferrer">juice-f.itch.io</a>
      </li>
    </ul>

  </div>
</template>

<style scoped>
.contact-page {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

ul {
  list-style: none;
  padding-inline-start: 0px;
  display: inline-block;
  text-align: left;
}

li {
    line-height: 1.8em;
    font-size: 1.2em;
  }

@media only screen and (min-width: 620px){
  ul {
    padding-inline-start: 40px;
  }

  li {
    line-height: 2em;
    font-size: 1.4em;
  }
}

i {
  margin-right: 20px;
}
</style>
