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
    <div class="qzq-playlist-container">
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
    .on("mousedown", ".qzq-playlist-container .ball", function (e) {
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
      $dragging = $(".qzq-playlist-container");
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
