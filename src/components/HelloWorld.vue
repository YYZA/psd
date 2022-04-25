<template>
  <div id="container">
    <input class="ratio" type="number" value="50" />
    <button class="button" @click="input()">비율설정</button>
    <div class="dropBox">
      <h1 class="title">Drop File</h1>
    </div>
    <div id="positon"></div>
    <div id="psd">
      <div id="list" v-for="(item, index) in test" :key="index">
        <input
          @click="image_use(item.layer, index)"
          :value="`${index}`"
          id="ck"
          type="checkbox"
        />
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
const cur_img = ref(null);
const coordX = ref(null);
const coordY = ref(null);
const box = ref(null);
// const openWin = window.open("/blank", "openWin");

onMounted(() => {
  const drop = document.querySelector(".dropBox");
  const title = document.querySelector(".dropBox h1");
  document.oncontextmenu = (e) => {
    e.preventDefault();
  };
  drop.ondrop = (e) => {
    e.preventDefault();

    // 드롭된 파일 리스트 가져오기
    const files = [...e.dataTransfer?.files];
    psd_file.value = files[0];
    title.innerHTML = files.map((file) => file.name).join("<br>");
  };

  // ondragover 이벤트가 없으면 onDrop 이벤트가 실핻되지 않습니다.
  drop.ondragover = (e) => {
    e.preventDefault();
  };
});

const input = () => {
  // const test2 = openWin.document.querySelector("#blank_box");
  const el = document.querySelector(".ratio");
  const ck = document.querySelectorAll("#ck");
  var val = el.value;

  val < 1 || val > 3200
    ? alert("1~3200 범위로 입력해 주십시오.") && (el.value = "")
    : null;

  Array.from(ck).map((p, idx) => {
    const del_ele = box.value.document.querySelector(`${"#L" + idx}`);
    p.checked ? del_ele.remove() : null;
  });

  PSD.fromDroppedFile(psd_file.value).then(function (psd) {
    console.log("dasda");
    test.value = psd.tree().descendants().reverse();
    box.value = window.open(
      "/blank",
      "openWin",
      `width=${(psd.image.width() * el.value) / 100}, height=${
        (psd.image.height() * el.value) / 100
      }`
    );
    // test2.style.width = `${(psd.image.width() * el.value) / 100}px`;
    // test2.style.height = `${(psd.image.height() * el.value) / 100}px`;
  });
  Array.from(ck).map((p, idx) => {
    p.checked ? image_use(test.value[idx].layer, idx) : null;
  });
  setTimeout(() => {
    const ck2 = document.querySelectorAll("#ck");
    test.value.map((p, idx) => {
      if (p.layer.visible === true && p.layer.width > 0) {
        return (ck2[idx].checked = true) && image_use(p.layer, idx);
      } else if (p.layer.visible === false && p.layer.width === 0) {
        return (ck2[idx].checked = false);
      }
    });
  }, 100);
};

const image_use = (file, index) => {
  setTimeout(() => {
    const ck = document.querySelectorAll("#ck");
    const test2 = box.value.document.querySelector("#blank_box");
    var newC = document.createElement("div");
    const el = document.querySelector(".ratio");
    const drag = box.value.document.querySelector("#drag");
    const vaaa = box.value.document.querySelector(`${"#L" + index}`);
    if (!vaaa && ck[index].checked) {
      ck[index].checked = true;
      newC.id = "L" + index;
      const width = file.image._width;
      const height = file.image._height;
      newC.style.background = `url(${file.image.toPng().src})`;
      newC.style.backgroundSize = "cover";
      // newC.src = file.image.toPng().src;cur_img.value
      // console.log(file.image.toPng().src);
      test2.appendChild(newC);

      newC.style.width = `${(width * el.value) / 100}px`;
      newC.style.height = `${(height * el.value) / 100}px`;
      newC.style.position = "absolute";
      newC.style.top = `${(test.value[index].coords.top * el.value) / 100}px`;
      newC.style.left = `${(test.value[index].coords.left * el.value) / 100}px`;
      newC.draggable = false;
      newC
        ? (newC.oncontextmenu = (e) => {
            if (cur_img.value !== null) {
              cur_img.value.style.cursor = "auto";
              cur_img.value.style.border = "";
              cur_img.value.draggable = false;
            }

            cur_img.value = e.target;
            var div2 = box.value.document.getElementById("dochi_context_menu");
            e.preventDefault();
            var x = e.pageX + "px"; // 현재 마우스의 X좌표
            var y = e.pageY + "px"; // 현재 마우스의 Y좌
            div2.style.display = "block";
            div2.style.left = x;
            div2.style.top = y;
            div2.style.zIndex = 9999;
            box.value.document.addEventListener("click", () => {
              div2.style.display = "none";
            });
            drag.onclick = () => {
              cur_img.value.style.border = "2px dashed black";
              cur_img.value.style.cursor = "grab";
              cur_img.value.style.zIndex = "9999";
              cur_img.value.draggable = true;
            };
            test2.ondragover = (e) => {
              e.preventDefault();
              coordX.value = e.offsetX;
              coordY.value = e.offsetY;
            };

            cur_img.value.ondragend = (e) => {
              if (test2.style.width === cur_img.value.style.width) {
                cur_img.value.style.zIndex = `${index + 10}`;
              } else if (test2.style.width !== cur_img.value.style.width) {
                cur_img.value.style.zIndex = `${index + 100}`;
              }
              setTimeout(() => {
                cur_img.value.style.top = `${
                  // coordY.value -
                  e.clientY -
                  cur_img.value.style.height
                    .split("")
                    .filter((element) => element !== "p")
                    .filter((element) => element !== "x")
                    .join("") *
                    0.5
                }px`;
                cur_img.value.style.left = `${
                  // coordX.value -
                  e.clientX -
                  cur_img.value.style.width
                    .split("")
                    .filter((element) => element !== "p")
                    .filter((element) => element !== "x")
                    .join("") *
                    0.5
                }px`;
              }, 200);
            };
          })
        : null;
      if (test2 !== null) {
        if (test2.style.width === newC.style.width) {
          newC.style.zIndex = `${index + 1}`;
        } else if (test2.style.width !== newC.style.width) {
          newC.style.zIndex = `${index + 10}`;
        }
      }
    } else if (vaaa && !ck[index].checked) {
      ck[index].checked = false;
      const del_ele = box.value.document.getElementById(`${"L" + index}`);
      console.log(del_ele);
      del_ele.remove();
    }
  }, 500);

  // console.log(newC);
};
</script>

<style scoped>
#positon {
  background: grey;
  position: relative;
  margin: auto;
}

.dropBox {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: dashed #f1e0f1;
  border-radius: 10px;
  width: 800px;
  height: 300px;
  background: #fafafa;
}
#list {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this componenasdt onasdsdaly -->
