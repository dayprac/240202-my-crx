$(function () {
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

  // 保存本地存储数据
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

  new ListOnOptions({
    target: $("#ListOnOptions")[0],
    props: {
      getData,
      setData,
    },
  });
});
