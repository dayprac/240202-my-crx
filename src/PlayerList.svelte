<script>
  import "./app.css";
  import { videos, someVideos } from "./stores";
  import Filter2 from "./components/Filter2.svelte";
  import VideoList from "./components/VideoList.svelte";

  import { onMount } from "svelte";
  // import { JSONEditor } from "svelte-jsoneditor";

  export let video, getData, setData;
  let version = "0.8119.1";

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
  // onMount(async () => {
  //   let data = await getData();
  //   console.log("[store onMount data]", data);

  //   videos.set(data);
  //   let url = window.location.href;
  //   someVideos.set(data.filter((i) => i.url === url));

  //   loading = false;
  // });

  videos.subscribe((value) => {
    // 打印两次，loading都是false，value第一次是空，第二次获得值
    // console.log("[store subscribe loading, value]", loading, value);
    if (!loading) {
      console.log("[store subscribe setData]");
      setData(value);
    }
  });
</script>

<div class="bg-purple-200">
  <div style="width:300px;">List v{version}</div>
  <div>
    <button on:click={refreshData}>刷新数据</button>
    <Filter2 />
  </div>
  {#if loading}
    <div>loading</div>
  {:else}
    <VideoList {video}></VideoList>
  {/if}
</div>
