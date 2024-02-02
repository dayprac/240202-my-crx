import PlayerListApp from "./PlayerList.svelte";
import $ from "jquery";
import Hls from "hls.js";

//#region 网页去色
let characters = [
  "乳奶腰", // 身体
  "交射", // 动作
  "色裸", // 描述
  "女父", // 角色🎭
  "网網码碼飲酔爆乱", // 遐想
];
let words = [
  "皮膚", // 身体
  "多P/", // 动作
  "有碼/舞碼/誘惑/淫亂", // 描述
  "學生/学生/美女/少女", // 角色🎭
  "媚藥", // 遐想
];
let forbiddenWords = [];
words.forEach((i) => forbiddenWords.push(i.split("/")));
characters.forEach((i) => forbiddenWords.push(Array.from(i)));
forbiddenWords = forbiddenWords.flat().filter((i) => i !== "");
let replacementText = "◯";

let placeHolderTemplate =
  "但是有一个关键的区别在构建编译阶段将你的应用程序转换为理想的应用而不是在运行阶段解释应用程序的代码这意味你不需要为框架所消耗的性能付出成本并且在应用程序首次加载时没有额外损失";
function generateRandomText(length) {
  if (length === 0) return "";
  let templateLen = placeHolderTemplate.length;
  let raw = placeHolderTemplate.repeat(Math.floor(length / templateLen) + 1);
  let startIndex = Math.floor(Math.random() * (placeHolderTemplate.length - 1));
  // console.log(randomInt); // 输出随机整数
  return raw.substr(startIndex, length);
}

let regReplaceHan = /([\u4e00-\u9fa5]+)/g;
function replaceForbiddenWords(element) {
  $(element)
    .contents()
    .each(function () {
      // console.log(this);
      if (this.nodeType === Node.TEXT_NODE) {
        let originalText = this.textContent;
        let replacedText = originalText;

        // $(forbiddenWords).each(function (index, word) {
        //   replacedText = replacedText.replace(
        //     new RegExp(word, "gi"),
        //     replacementText
        //   );
        //   // replacedText = replacedText.replaceAll(word, replacementText);
        // });

        // replacedText = replacedText.replace(regReplaceHan, replacementText);
        replacedText = replacedText.replace(regReplaceHan, (match) => {
          let _new = generateRandomText(match.length);
          // console.log("[match]", match, _new);
          return _new;
        });

        if (replacedText !== originalText) {
          this.textContent = replacedText;
        }
      } else if (this.nodeType === Node.ELEMENT_NODE) {
        replaceForbiddenWords(this);
      }
    });
}

$("img").css("visibility", "hidden");
$("iframe").css("visibility", "hidden");
replaceForbiddenWords("body");
//#endregion

//#region 读写数据
// 读取本地存储的数据
async function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      var data = localStorage.getItem("qzq-playlist");
      if (data !== null) {
        // 本地存储里面的数据是字符串格式的 但是我们需要的是对象格式的
        //   return JSON.parse(data);
        resolve(JSON.parse(data));
      } else {
        // return [
        //   { start: 0, end: 1 },
        //   { start: 1, end: 2 },
        // ];
        //   return [];
        resolve([]);
      }
    }, 500);
  });
}
// 保存本地存储数据
async function setData(data) {
  return new Promise((resolve, reject) => {
    console.log("[saveData]");
    localStorage.setItem("qzq-playlist", JSON.stringify(data));
    resolve();
  });
}
//#endregion

let videoRegion = null;
let container = null;

var video = document.getElementById("video");
if (Hls.isSupported()) {
  var hls = new Hls();
  // hls.loadSource("http://192.168.0.3:8106/hls/lucene.m3u8");
  hls.loadSource("http://127.0.0.1:8106/hls/lucene.m3u8");
  hls.attachMedia(video);
  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    video.muted = true;
    video.play();
  });
}

videoRegion = $(".pb-3.pb-e-lg-30");
container = $(`
      <div class="qzq-playlist-container">
        <div>Container</div>
      </div>
    `);
console.log(videoRegion.css("width"));
container.css({
  position: "absolute",
  top: 0,
  // right: "-1" + container.css("width"),
  left: parseInt(videoRegion.css("width").replace("px", "")) + 15 + "px",
  // left: "-" + wrapper.css("width"),
  // right: 0,
  zIndex: 999,
});
videoRegion.append(container);
container.empty();

const app = new PlayerListApp({
  target: container[0],
  props: {
    video: videoRegion.find("video")[0],
    getData,
    setData,
  },
});

export default app;
