<script>
  import "./app.css";
  import { videos, someVideos } from "./stores";
  import { onMount } from "svelte";
  export let getData, setData;
  import VideoList from "./components/VideoList.svelte";
  import Filter from "./components/Filter.svelte";
  let linkHref, linkDownload, linkFileName;

  let loading = true;
  onMount(async () => {
    refreshData();
  });

  const refreshData = async () => {
    loading = true;
    let data = await getData();
    videos.set(data);
    // someVideos.set(data);

    loading = false;
  };

  videos.subscribe((value) => {
    // 打印两次，loading都是false，value第一次是空，第二次获得值
    // console.log("[store subscribe loading, value]", loading, value);
    if (!loading) {
      let url = window.location.href;
      // someVideos.set(value);

      console.log("[store subscribe setData]");
      setData(value);
    }
  });
</script>

<div>qzq-playlist 列表</div>
<div>
  <button
    on:click={async () => {
      let data = await getData();
      //   const file = new File(["foo"], "new-note.txt", {
      //     type: "text/plain",
      //   });

      //   data = [{ a: 1 }, { a: 2, b: 4 }];

      let text = JSON.stringify(data, undefined, 2);
      console.log(text);

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const formattedTime =
        year + month + day + "-" + hours + minutes + seconds;

      //   let fileName = "xxx.json";
      linkFileName = `qzq-playlist-${formattedTime}.json`;

      const file = new File([text], linkFileName, {
        type: "application/json",
      });
      linkHref = URL.createObjectURL(file);
      linkDownload = file.name;
    }}>导出json</button
  >
  <a href={linkHref} download={linkDownload}>下载 {linkFileName}</a>
</div>
<div>
  <input
    type="file"
    name=""
    id="uploadedJson"
    on:change={(e) => {
      console.log("[input file e]", e);
      if (e.target.files.length > 0) {
        let file = e.target.files[0];
        let reader = new FileReader();
        // This event listener will happen when the reader has read the file
        reader.addEventListener("load", function (e) {
          var result = JSON.parse(e.target.result); // Parse the result into an object
          console.log("[FileReader load]", result);
          setData(result);
        });

        reader.readAsText(file); // Read the uploaded file
      }
    }}
  />
  <button on:click={() => {}}>导入json</button>
</div>
<hr class="mb-10" />

<div>
  <button on:click={refreshData}>刷新数据</button>
  <Filter />
</div>

<div class="bg-purple-200" style="font-size: 12px; color: black">
  {#if loading}
    <div>loading</div>
  {:else}
    <VideoList video={null}></VideoList>
  {/if}
</div>
