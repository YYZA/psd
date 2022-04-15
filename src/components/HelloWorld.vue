<template>
  <div id="container">
    <div id="positon"></div>
    <input id="input" type="file" />
    <div id="psd">
      <div id="list" v-for="(item, index) in test" :key="index">
        <input @click="ggggg(index)" id="ck" type="checkbox" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import PSD from "psd.js/dist/psd.min";
import { onMounted, ref } from "vue";

const psd_file = ref(null);
const test = ref(null);

onMounted(() => {
  const dddd = document.querySelector("#input");
  // const test2 = document.querySelector("#psd");
  dddd.addEventListener("change", (e) => {
    psd_file.value = e.target.files[0];
    PSD.fromDroppedFile(psd_file.value).then(function (psd) {
      // console.log(psd.image.toPng());
      test.value = psd.tree().descendants();
      console.log(test.value);
      // test2.appendChild(test.value[26].layer.image.toPng());
      // test2.appendChild(test.value[4].layer.image.toPng());
    });
  });
});

const ggggg = (index) => {
  const test2 = document.querySelector("#positon");
  const ck = document.querySelectorAll("#ck");
  var newC = document.createElement("img");
  if (ck[index].checked) {
    ck[index].checked = true;
    newC.id = "L" + index;
    console.log(test.value[index].layer);
    const width = test.value[index].layer.image._width;
    const height = test.value[index].layer.image._height;
    newC.src = test.value[index].layer.image.toPng().src;
    // console.log(test.value[index].layer.image.toPng().src);
    test2.appendChild(newC);
    newC.style.width = `${(width * 10) / 100}px`;
    newC.style.height = `${(height * 10) / 100}px`;
    newC.style.position = "absolute";
    newC.style.top = `${(test.value[index].coords.top * 10) / 100}px`;
    newC.style.left = `${(test.value[index].coords.left * 10) / 100}px`;
    newC.style.right = `${(test.value[index].coords.right * 10) / 100}px`;
    newC.style.bottom = `${(test.value[index].coords.bottom * 10) / 100}px`;
  } else if (!ck[index].checked) {
    ck[index].checked = false;
    const testtt = document.querySelector(`${"#L" + index}`);
    testtt.remove();
  }

  // console.log(newC);
};
</script>
<style scoped>
#positon {
  background: black;
  position: relative;
  width: 555.1px;
  height: 295.3px;
  margin: auto;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this componenasdt onasdsdaly -->
