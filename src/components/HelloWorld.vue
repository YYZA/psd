<template>
  <div id="psd"></div>
  <div v-for="(item, index) in test" :key="index">
    <p @click="ggggg(index)">{{ item.name }}</p>
  </div>
</template>

<script setup>
import PSD from "psd.js/dist/psd.min";
import { ref } from "vue";

const test = ref(null);
PSD.fromURL("https://filedrive.github.io/pen/mask.psd").then(function (psd) {
  test.value = psd.tree().descendants();
});

const ggggg = (index) => {
  PSD.fromURL("https://filedrive.github.io/pen/mask.psd").then(function (psd) {
    parsePsd(psd, index);
  });
};

const parsePsd = (psd, index) => {
  var node;
  var PsdW = psd.image.width();
  var PsdH = psd.image.height();
  node = psd.tree().descendants()[index];
  draw(node);

  function draw(n) {
    const randomNumber = Math.floor(Math.random() * 50 + 10);
    var node = n;
    if (node.layer.mask.defaultColor === undefined) {
      // console.info(node.name,"- маски нет");
      return false;
    }
    var MaskW = node.layer.mask.width;
    var MaskH = node.layer.mask.height;
    var MaskT = node.layer.mask.top;
    var MaskL = node.layer.mask.left;
    var MaskC = node.get("mask").defaultColor;
    var newC = document.createElement("canvas");
    newC.id = "L" + randomNumber;

    newC.setAttribute("data-name", node.name);
    document.getElementById("psd").appendChild(newC);
    var elem = document.getElementById("L" + randomNumber);
    var ctx = elem.getContext("2d");
    elem.width = PsdW;
    elem.height = PsdH;
    if (MaskC !== 0) {
      ctx.fillRect(0, 0, PsdW, PsdH);
    }
    if (MaskW !== 0 && MaskH !== 0) {
      var checkMask = parseMask(getMask());
      if (checkMask) {
        var MaskImage = ctx.createImageData(MaskW, MaskH);
        if (MaskImage.data.set) {
          MaskImage.data.set(checkMask);
        } else {
          checkMask.forEach(function (val, i) {
            MaskImage.data[i] = val;
          });
        }
        ctx.putImageData(MaskImage, MaskL, MaskT);
      } else {
        console.error("oops");
      }
    }
  }
  function parseMask(mask) {
    var МaskData = [];
    var ModeRAW = 0;
    var NotUseful = node.layer.mask.height * 2 + 2;
    if (mask[1] == 1) {
      //RLE
      for (var i = NotUseful; i < mask.length; i++) {
        var elem = mask[i];
        if (ModeRAW === 0) {
          //if(mask[i+1]===undefined)console.error("No next character!");
          if (elem < 128) {
            // 128?
            ModeRAW = +elem + 1; //Enable modeRAW to elem+1
          } else {
            var Repeat = 257 - elem; //257
            var Color = mask[i + 1];
            var r = 0;
            while (r < Repeat) {
              //Duplicate characters
              МaskData.push(0, 0, 0, Color);
              r++;
            }
            i++; //skip next step
          }
        } else {
          //ModeRAW
          МaskData.push(0, 0, 0, elem);
          ModeRAW--;
        }
      }
    } else if (mask[1] === 0) {
      //RAW
      МaskData = mask.join(",0,0,0,").slice(10).split(","); //bad
    } else {
      //zip?
      console.error("oops", mask[0], mask[1]);
    }
    return МaskData;
  }
  function getMask() {
    if (
      /*image.hasMask&&*/ node.layer.mask.width /*>0*/ &&
      node.layer.mask.height /*>0*/
    ) {
      var StartPos = node.layer.image.startPos;
      var EndPos;
      var inf = node.get("channelsInfo");
      for (var i = 0; i < inf.length; i++) {
        var elem = inf[i];
        if (elem.id == -2) {
          //-2 mask channel
          EndPos = StartPos + elem.length;
          break;
        } else {
          StartPos = StartPos + elem.length;
        }
      }

      return psd.file.data.slice(StartPos, EndPos);
    } else {
      console.error("oops, it seems there is no mask");
      return false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this componenasdt onasdsdaly -->
