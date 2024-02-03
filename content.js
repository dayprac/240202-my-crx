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
});

function injectPlaylist(wrapper) {
  let container = $(`<div></div>`);
  container.css({
    position: "absolute",
    top: 0,
    // right: "-1" + container.css("width"),
    left: wrapper.css("width"),
    // left: "-" + wrapper.css("width"),
    // right: 0,
    zIndex: 999,
  });
  wrapper.append(container);
  // initPlaylist(container, wrapper);
  container.empty();
  new PlayerList({
    target: container[0],
    props: {
      video: wrapper.find("video")[0],
      getData,
      setData,
    },
  });
}
