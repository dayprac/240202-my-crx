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

function addVideo() {
  $("#app").html(`
    <div class="div1">
      <div>
        <video style="width:500px" controls></video>
      </div>
      <div style="width:500px;height:500px;background-color:pink;">
      </div>
    </div>
    <div style="margin-top: 5px">
      <video style="width:400px" controls></video>
    </div>
  `);

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
}

// addVideo();
setTimeout(() => {
  addVideo();
}, 3000);

// $(function () {
//   let url = window.location.href;
//   if (url.includes("jable")) {
//     // jable
//     $(".pb-3.pb-e-lg-30").each(function () {
//       injectPlaylist($(this));
//     });
//   } else if (url.includes("youtube")) {
//     // youtube
//     setTimeout(() => {
//       $(".style-scope.ytd-player").each(function () {
//         injectPlaylist($(this));
//       });
//     }, 3000);
//   } else if (url.includes("pan.baidu")) {
//     //百度网盘
//     setTimeout(() => {
//       $(".vp-video__player").each(function () {
//         injectPlaylist($(this).parents("section"));
//       });
//     }, 3000);
//   } else if (url.includes("x18r")) {
//     // x18r
//     setTimeout(() => {
//       $("#wrap-slider").each(function () {
//         injectPlaylist($(this));
//       });
//     }, 6000);
//   } else {
//     // todo div定位过程 移植到content.js中不顺
//     $("video").each(function () {
//       let $divParents = $(this).parents();
//       console.log($divParents); // 所有祖先中是div的节点
//       // let div = $($div[0]);
//       // injectPlaylist($($div[0]));
//       let videoWidth = $(this).width();
//       let videoHeight = $(this).height();
//       console.log("[debug videoWidth videoHeight]", videoWidth, videoHeight);
//       let infos = [];
//       for (let i = 0; i < $divParents.length; i++) {
//         let $div = $($divParents[i]);
//         infos.push({
//           index: i,
//           width: $div.width(),
//           height: $div.height(),
//           $ele: $div,
//         });
//       }
//       console.log("[debug infos before filter]", infos);
//       infos = infos.filter((i) => {
//         if (
//           i.width >= videoWidth &&
//           i.width <= videoWidth * 1.3
//           // i.height >= videoHeight &&
//           // i.height <= videoHeight * 1.3
//         ) {
//           return true;
//         } else {
//           return false;
//         }
//       });
//       console.log("[debug infos after filter]", infos);
//       if (infos.length > 0) {
//         injectPlaylist(infos[infos.length - 1].$ele);
//       }
//     });
//   }

//   $(".bg-purple-200").on("keydown", function (e) {
//     e.stopPropagation();
//   });
//   $(".bg-purple-200").on("keyup", function (e) {
//     e.stopPropagation();
//   });
// });

$(function () {
  let $video = null;
  //#region 搜索video
  if (get$Video()) {
    $video = get$Video();
    console.log("[debug 搜索video $video]", $video);
    injectPlaylist($video);
  } else {
    const searchLimit = 30;
    let searchCount = 0;
    let timer = setInterval(() => {
      // console.log("[debug 搜索video searchCount]", searchCount);
      if (get$Video()) {
        $video = get$Video();
        console.log("[debug 搜索video $video]", $video);
        clearInterval(timer);
        injectPlaylist($video);
      }
      searchCount += 1;
      if (searchCount > searchLimit) {
        clearInterval(timer);
        console.log("[debug 放弃搜索video]");
      }
    }, 1000);
  }
  //#endregion 搜索video
});

function injectPlaylist($video) {
  let container = $(`
    <div class="qzqroot">
      <div class="ball"></div>
      <div class="wrapper"></div>
    </div>
  `);
  $("body").append(container);
  container.css({
    position: "absolute",
    top: $video.offset().top,
    // left: parseInt($video.offset().left + $video.width()) - 40 + "px",
    left: $video.offset().left + $video.width(),
    display: "none",
    zIndex: 999999,
  });
  container.css({ display: "flex" });

  //#region 设置可拖拽
  var $dragging = null;
  $("body")
    .on("mousedown", ".qzqroot .ball", function (e) {
      $(this).attr("unselectable", "on").addClass("draggable");
      var el_w = $(".draggable").outerWidth(),
        el_h = $(".draggable").outerHeight();
      $("body").on("mousemove", function (e) {
        if ($dragging) {
          $dragging.offset({
            top: e.pageY - el_h / 2,
            left: e.pageX - el_w / 2,
          });
        }
      });
      // $dragging = $(e.target);
      $dragging = $(".qzqroot");
    })
    .on("mouseup", ".draggable", function (e) {
      $dragging = null;
      $(this).removeAttr("unselectable").removeClass("draggable");
    });
  //#endregion 设置可拖拽

  container.find(".ball").css({
    width: "40px",
    height: "40px",
    backgroundColor: "skyblue",
    cursor: "pointer",
  });
  // container.find(".ball").animate({ opacity: "0" }, 4000);

  // container
  //   .find(".ball")
  //   .on("mouseenter", function () {
  //     container.find(".ball").animate({ opacity: "1" }, 200);
  //   })
  //   .on("mouseleave", function () {
  //     container.find(".ball").animate({ opacity: "0" }, 200);
  //   });

  container.find(".wrapper").hide();
  new PlayerList({
    target: container.find(".wrapper")[0],
    props: {
      video: $video[0],
      getData,
      setData,
    },
  });
  $(".bg-purple-200").on("keydown", function (e) {
    e.stopPropagation();
  });
  $(".bg-purple-200").on("keyup", function (e) {
    e.stopPropagation();
  });
  // 读数据然后显示出来要一段时间
  setTimeout(() => {
    // console.log(container.find("a").length);
    container.find(".ball").text(container.find(".video-title").length);
    if (container.find(".video-title").length > 0) {
      container.find(".wrapper").show();
    }
  }, 500);

  container.find(".ball").on("mousedown", function () {
    setTimeout(() => {
      if (!$dragging) {
        container.find(".wrapper").toggle();
      }
    }, 200);
  });
}

function get$Video() {
  let $videos = $("video"); // 没有时是null
  // console.log("[debug get$Video]", $videos);
  if ($videos === null || $videos === undefined || $videos.length === 0) {
    return null;
  } else {
    return $($("video")[0]);
  }
}
