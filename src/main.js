import PlayerList from "./PlayerList.svelte";
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

$("video").each((_, ele) => {
  // console.log(ele);
  let video = ele;
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
});

$(function () {
  let url = window.location.href;
  if (url.includes("jable")) {
    // jable
    $(".pb-3.pb-e-lg-30").each(function () {
      injectPlaylist($(this));
    });
  } else if (url.includes("youtube")) {
    // youtube
    setTimeout(() => {
      $(".style-scope.ytd-player").each(function () {
        injectPlaylist($(this));
      });
    }, 3000);
  } else if (url.includes("pan.baidu")) {
    //百度网盘
    setTimeout(() => {
      $(".vp-video__player").each(function () {
        injectPlaylist($(this).parents("section"));
      });
    }, 3000);
  } else if (url.includes("x18r")) {
    // x18r
    setTimeout(() => {
      $("#wrap-slider").each(function () {
        injectPlaylist($(this));
      });
    }, 6000);
  } else {
    // todo div定位过程 移植到content.js中不顺
    $("video").each(function () {
      let $divParents = $(this).parents();
      console.log($divParents); // 所有祖先中是div的节点
      // let div = $($div[0]);
      // injectPlaylist($($div[0]));
      let videoWidth = $(this).width();
      let videoHeight = $(this).height();
      console.log("[debug videoWidth videoHeight]", videoWidth, videoHeight);
      let infos = [];
      for (let i = 0; i < $divParents.length; i++) {
        let $div = $($divParents[i]);
        infos.push({
          index: i,
          width: $div.width(),
          height: $div.height(),
          $ele: $div,
        });
      }
      console.log("[debug infos before filter]", infos);
      infos = infos.filter((i) => {
        if (
          i.width >= videoWidth &&
          i.width <= videoWidth * 1.3
          // i.height >= videoHeight &&
          // i.height <= videoHeight * 1.3
        ) {
          return true;
        } else {
          return false;
        }
      });
      console.log("[debug infos after filter]", infos);
      if (infos.length > 0) {
        injectPlaylist(infos[infos.length - 1].$ele);
      }
    });
  }

  $(".bg-purple-200").on("keydown", function (e) {
    e.stopPropagation();
  });
  $(".bg-purple-200").on("keyup", function (e) {
    e.stopPropagation();
  });
});

function injectPlaylist($div) {
  console.log("[debug injectPlaylist", $div);
  $div.css({ position: "relative" });
  let container = $(`
    <div class="qzq-playlist-container">
      <div class="ball"></div>
      <div class="wrapper"></div>
    </div>
  `);
  // $div.after(container);
  $div.append(container);
  container.css({
    position: "absolute",
    top: 0,
    left: "100%",
    display: "flex",
    zIndex: 999,
  });

  container.find(".ball").css({
    position: "absolute",
    width: "40px",
    height: "40px",
    left: "-40px",
    backgroundColor: "skyblue",
    cursor: "pointer",
  });
  // container.find(".wrapper").css({
  //   position: "absolute",
  //   top: 0,
  //   left: "40px",
  // });
  // $("<span><span>").insertAfter($(this)).append(container);
  // $("<span>Hi<span>").insertAfter($(this));

  // container.fadeOut("slow");
  container.find(".ball").animate({ opacity: "0" }, 4000);

  container.find(".ball").hover(
    function () {
      container.find(".ball").animate({ opacity: "1" }, 200);
    },
    function () {
      container.find(".ball").animate({ opacity: "0" }, 200);
    }
  );

  const app = new PlayerList({
    target: container.find(".wrapper")[0],
    props: {
      video: $div.find("video")[0],
      getData,
      setData,
    },
  });
  container.find(".ball").on("click", function () {
    container.find(".wrapper").toggle();
  });
}
