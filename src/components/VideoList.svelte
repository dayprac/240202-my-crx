<script>
  import { onMount } from "svelte";
  import TimeRangeList from "./TimeRangeList.svelte";
  import { videos, someVideos } from "../stores";
  export let video;

  let toAdd = null;

  let url, title, m3u8, description;

  onMount(() => {
    url = window.location.href;
    title = window.document.title;
    // videoListData = data.filter((i) => i.url === url);
  });

  let videoListData;
  someVideos.subscribe((value) => {
    videoListData = value;
  });

  // $: videoListData = data.filter((i) => i.url === url);
  // $: filteredData = data.filter((i) => i.url === url);
</script>

<div>
  {#if !toAdd}
    <div><button on:click={() => (toAdd = true)}>为当前视频添加</button></div>
  {:else}
    <div class="flex">
      <div><input type="text" bind:value={url} /></div>
    </div>
    <div class="flex">
      <div><input type="text" bind:value={title} /></div>
    </div>
    <div class="flex">
      <div><input type="text" bind:value={m3u8} /></div>
    </div>
    <div class="flex">
      <div><input type="text" bind:value={description} /></div>
    </div>
    <div>
      <button
        on:click={() => {
          videos.update((data) => {
            let newData = [
              ...data,
              {
                id: Date.now().toString(),
                url,
                title,
                m3u8,
                description,
                ranges: [],
              },
            ];
            return newData;
          });
          toAdd = false;
        }}
        >新增
      </button>
      <button
        on:click={() => {
          toAdd = false;
        }}>放弃</button
      >
    </div>
  {/if}
</div>
<div>
  {#each videoListData as videoData, index (videoData.id)}
    {#if videoData.url === url}
      <div class="video-title">{videoData.title}</div>
    {:else}
      <div>
        <a class="video-title" href={videoData.url} target="_blank"
          >{videoData.title}</a
        >
      </div>
    {/if}
    <TimeRangeList {video} {videoData}></TimeRangeList>
  {/each}
</div>
