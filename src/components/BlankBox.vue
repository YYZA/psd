<template>
  <div>
    <div id="blank_box"></div>
    <div
      id="dochi_context_menu"
      class="custom-context-menu"
      style="display: none"
    >
      <ul>
        <li id="drag"><a>drag & drop</a></li>
        <li id="scale"><a>Scale</a></li>
        <li id="rotate"><a>Rotate</a></li>
      </ul>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.custom-context-menu {
  position: absolute;
  box-sizing: border-box;
  min-height: 100px;
  min-width: 200px;
  background-color: #ffffff;
  box-shadow: 0 0 1px 2px lightgrey;
}

.custom-context-menu ul {
  list-style: none;
  padding: 0;
  background-color: transparent;
}

.custom-context-menu li {
  padding: 3px 5px;
  cursor: pointer;
}

.custom-context-menu li:hover {
  background-color: #f0f0f0;
}
</style>
