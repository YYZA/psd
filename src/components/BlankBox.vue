<template>
  <div id="container">
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
<script setup>
// import interact from "interactjs";
// import { onMounted } from "vue";

// onMounted(() => {
//   const scale = document.querySelector("#scale");
//   scale.onclick = () => {
//     const L2 = document.querySelector("#L5");
//     L2.style.border = "1px black solid";
//     console.log(interact("#L5").resizable());
//     interact("#L5")
//       .resizable({
//         // preserveAspectRatio: false,
//         edges: {
//           left: true,
//           right: true,
//           bottom: true,
//           top: true,
//         },
//       })
//       .on("resizestart", function (event) {
//         console.info("resizestart = ", event);
//       })
//       .on("resizemove", function (event) {
//         console.info("resizemove = ", event);
//         console.log(event.target);
//         var target = event.target,
//           x = parseFloat(target.getAttribute("data-x")) || 0,
//           y = parseFloat(target.getAttribute("data-y")) || 0;

//         // update the element's style
//         target.style.width = event.rect.width + "px";
//         target.style.height = event.rect.height + "px";

//         // translate when resizing from top or left edges
//         x += event.deltaRect.left;
//         y += event.deltaRect.top;

//         target.style.webkitTransform = target.style.transform =
//           "translate(" + x + "px," + y + "px)";

//         target.setAttribute("data-x", x);
//         target.setAttribute("data-y", y);
//       });
//   };
// });
</script>
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
