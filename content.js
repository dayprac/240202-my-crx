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
