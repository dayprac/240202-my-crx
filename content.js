console.log("[my-crx content.js]");

//#region 读写数据
const getData = async () => {
  const key = "qzq-playlist";
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        //   reject();
        const mock = [{ start: 50, end: 80, description: "mock" }];
        // resolve(mock);
        resolve([]);
      } else {
        resolve(result[key]);
      }
    });
  });
};

function setData(data) {
  const key = "qzq-playlist";
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(
      {
        "qzq-playlist": data,
      },
      function (result) {
        // undefined
        // console.log("[saveData]", result);
        resolve();
      }
    );
  });
}
//#endregion

$(function () {
  $(".pb-3.pb-e-lg-30 video").each(function () {
    console.log("[.plyr video]");
    // let jqVideo = $(".plyr video");
    // let video = jqVideo[0];
    // if (Hls.isSupported()) {
    //   var hls = new Hls();
    //   hls.loadSource(jqVideo.attr("m3u8"));
    //   hls.attachMedia(video);
    //   hls.on(Hls.Events.MANIFEST_PARSED, function () {
    //     video.play();
    //   });
    // }
    // const player = new Plyr(video);
    // console.log(player)

    // jq版本
    injectPlaylist($(this).parents(".pb-3.pb-e-lg-30"));
  });
  // youtube
  setTimeout(() => {
    $(".style-scope.ytd-player video").each(function () {
      injectPlaylist($(this).parents(".style-scope.ytd-player"));
    });
  }, 3000);
  //百度网盘
  setTimeout(() => {
    console.log("[debug 百度网盘]");
    // document.querySelectorAll(".vjs-tech") // 发现有两个
    $(".vp-video__player").each(function () {
      injectPlaylist($(this).parents("section"));
    });
    // $(".vp-vip-pri").append('<input type="text">').on("keydown", function(e) {
    //   console.log('[debug keydown]', e)
    //   e.stopPropagation();
    // })
    $(".bg-purple-200").on("keydown", function (e) {
      e.stopPropagation();
    });
    $(".bg-purple-200").on("keyup", function (e) {
      e.stopPropagation();
    });
  }, 3000);
  // x18r
  setTimeout(() => {
    $("#wrap-slider video").each(function () {
      injectPlaylist($(this).parents("#wrap-slider"));
    });
  }, 6000);
});

function injectPlaylist($div) {
  console.log("[debug injectPlaylist", $div);
  // $div.css({ position: "relative" });
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
    // left: 0,
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
