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
import PSD from "psd.js/dist/psd.min";
import { onMounted, ref } from "vue";
import interact from "interactjs";

const psd_file = ref(null);
const test = ref(null);
const cur_img = ref(null);
const coord = ref(null);
const coord_drag = ref(null);
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
  if (box.value) {
    box.value.close("/blank", "openWin");
  }
  val < 1 || val > 3200
    ? alert("1~3200 범위로 입력해 주십시오.") && (el.value = "")
    : null;

  Array.from(ck).map((p, idx) => {
    const del_ele = box.value.document.querySelector(`${"#L" + idx}`);
    p.checked ? del_ele.remove() : null;
  });

  PSD.fromDroppedFile(psd_file.value).then(function (psd) {
    const test2 = document.querySelector("#positon");
    console.log(el.value);
    test.value = psd.tree().descendants().reverse();
    const width = `${(psd.image.width() * el.value) / 100}px`;
    const height = `${(psd.image.height() * el.value) / 100}px`;
    test2.style.width = width;
    test2.style.height = height;
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
    const test2 = document.querySelector("#positon");
    var newC = document.createElement("img");

    const el = document.querySelector(".ratio");
    const drag = document.querySelector("#drag");
    const scale = document.querySelector("#scale");
    const rotate = document.querySelector("#rotate");

    const vaaa = document.querySelector(`${"#L" + index}`);
    if (!vaaa && ck[index].checked) {
      ck[index].checked = true;
      newC.id = "L" + index;

      const width = file.image._width;
      const height = file.image._height;
      // newC.style.background = `url(${file.image.toPng().src})`;
      newC.style.backgroundSize = "cover";
      newC.src = file.image.toPng().src;

      cur_img.value;
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
              interact(cur_img.value).unset();
              // cur_img.value.style.cursor = "auto";
              cur_img.value.style.border = "";
              cur_img.value.draggable = false;
            }
            cur_img.value = e.target;
            var div2 = document.getElementById("dochi_context_menu");
            e.preventDefault();
            var x = e.pageX + "px"; // 현재 마우스의 X좌표
            var y = e.pageY + "px"; // 현재 마우스의 Y좌
            div2.style.display = "block";
            div2.style.left = x;
            div2.style.top = y;
            div2.style.zIndex = 9999;
            document.addEventListener("click", () => {
              div2.style.display = "none";
            });
            drag.onclick = () => {
              cur_img.value.style.border = "2px dashed black";
              // cur_img.value.style.cursor = "grab";
              cur_img.value.style.zIndex = "9999";
              cur_img.value.draggable = true;
              interact(cur_img.value).draggable({
                onmove: dragMoveListener,
              });
              function dragMoveListener(event) {
                var target = event.target,
                  // keep the dragged position in the data-x/data-y attributes
                  x =
                    (parseFloat(target.getAttribute("data-x")) || 0) + event.dx,
                  y =
                    (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

                // translate the element
                coord_drag.value = "translate(" + x + "px, " + y + "px)";
                coord.value !== null
                  ? (target.style.webkitTransform = target.style.transform =
                      "translate(" + x + "px, " + y + "px)" + `${coord.value}`)
                  : (target.style.webkitTransform = target.style.transform =
                      "translate(" + x + "px, " + y + "px)");

                // update the posiion attributes
                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
                z_index();
              }
            };
            scale.onclick = () => {
              // console.log(box.value.document.querySelector("#L8"));
              cur_img.value.style.border = "2px dashed black";
              cur_img.value.style.zIndex = "9999";
              interact(cur_img.value)
                .resizable({
                  preserveAspectRatio: false,
                  edges: {
                    left: true,
                    right: true,
                    bottom: true,
                    top: true,
                  },
                })
                .on("resizestart", function (event) {
                  console.info("resizestart = ", event);
                })
                .on("resizemove", function (event) {
                  console.info("resizemove = ", event);

                  var target = event.target,
                    x = parseFloat(target.getAttribute("data-x")) || 0,
                    y = parseFloat(target.getAttribute("data-y")) || 0;

                  // update the element's style
                  target.style.width = event.rect.width + "px";
                  target.style.height = event.rect.height + "px";

                  // translate when resizing from top or left edges
                  x += event.deltaRect.left;
                  y += event.deltaRect.top;

                  coord.value !== null
                    ? (target.style.webkitTransform = target.style.transform =
                        "translate(" +
                        x +
                        "px, " +
                        y +
                        "px)" +
                        `${coord.value}`)
                    : (target.style.webkitTransform = target.style.transform =
                        "translate(" + x + "px, " + y + "px)");

                  target.setAttribute("data-x", x);
                  target.setAttribute("data-y", y);
                  z_index();
                });
            };
            rotate.onclick = () => {
              cur_img.value.style.border = "2px dashed black";
              interact(cur_img.value).draggable({
                onstart: function (event) {
                  const element = event.target;
                  console.log("로테이트 ::", element);
                  const rect = element.getBoundingClientRect();

                  // store the center as the element has css `transform-origin: center center`
                  element.dataset.centerX = rect.left + rect.width / 2;
                  element.dataset.centerY = rect.top + rect.height / 2;
                  // get the angle of the element when the drag starts
                  element.dataset.angle = getDragAngle(event);
                },
                onmove: function (event) {
                  var element = event.target;

                  // (x = parseFloat(element.getAttribute("data-x")) || 0),
                  // (y = parseFloat(element.getAttribute("data-y")) || 0);

                  var angle = getDragAngle(event);

                  // update transform style on dragmove
                  coord.value = "rotate(" + angle + "rad" + ") ";
                  coord_drag.value !== null
                    ? (element.style.webkitTransform = element.style.transform =
                        `${coord_drag.value}` + "rotate(" + angle + "rad" + ")")
                    : (element.style.webkitTransform = element.style.transform =
                        "rotate(" + angle + "rad" + ")");
                },
                onend: function (event) {
                  const element = event.target;
                  z_index();

                  // save the angle on dragend
                  element.dataset.angle = getDragAngle(event);
                },
              });

              function getDragAngle(event) {
                var element = event.target;
                var startAngle = parseFloat(element.dataset.angle) || 0;
                var center = {
                  x: parseFloat(element.dataset.centerX) || 0,
                  y: parseFloat(element.dataset.centerY) || 0,
                };

                var angle = Math.atan2(
                  center.y - event.clientY,
                  center.x - event.clientX
                );
                console.log(element.dataset);
                return angle - startAngle;
              }
            };
          })
        : null;

      const z_index = () => {
        if (test2 !== null) {
          if (test2.style.width === cur_img.value.style.width) {
            cur_img.value.style.zIndex = `${index + 10}`;
          } else if (test2.style.width !== cur_img.value.style.width) {
            cur_img.value.style.zIndex = `${index + 100}`;
          }
        }
      };
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
