import ListOnOptions from "./ListOnOptions.svelte";

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

const app = new ListOnOptions({
  target: document.querySelector("#app"),
  props: {
    getData,
    setData,
  },
});

export default app;
