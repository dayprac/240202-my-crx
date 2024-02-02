<script>
  import { onMount } from "svelte";
  import { videos, someVideos } from "../stores";
  let searchUrl, searchTitle, searchVideoDesc, searchRangeDesc;
  let _videos;

  onMount(async () => {
    searchUrl = window.location.href;
    refreshViewData();
  });

  const refreshViewData = async () => {
    console.log("[debug refreshViewData]");
    let newViewData = _videos;
    if (typeof searchUrl === "string" && searchUrl.trim() !== "") {
      newViewData = _videos.filter(
        (video) => video.url.indexOf(searchUrl) >= 0
      );
    }
    if (typeof searchTitle === "string" && searchTitle.trim() !== "") {
      newViewData = newViewData.filter(
        (video) => video.title.indexOf(searchTitle) >= 0
      );
    }
    if (typeof searchVideoDesc === "string" && searchVideoDesc.trim() !== "") {
      newViewData = newViewData.filter(
        (video) => video.description.indexOf(searchVideoDesc) >= 0
      );
    }
    if (typeof searchRangeDesc === "string" && searchRangeDesc.trim() !== "") {
      newViewData = newViewData.filter((video) => {
        let hasRange =
          video.ranges.filter(
            (r) => r.description.indexOf(searchRangeDesc) >= 0
          ).length > 0;
        return hasRange;
      });
    }

    someVideos.set(newViewData);
  };

  videos.subscribe((value) => {
    _videos = value;
    refreshViewData();
  });
</script>

<div>
  <div><button on:click={refreshViewData}>重新搜索</button></div>
  <div>
    <input type="text" bind:value={searchUrl} />
    <button
      on:click={() => {
        someVideos.set(
          _videos.filter((video) => video.url.indexOf(searchUrl) >= 0)
        );
      }}>搜索url</button
    >
  </div>
  <div>
    <input type="text" bind:value={searchTitle} />
    <button
      on:click={() => {
        someVideos.set(
          _videos.filter((video) => video.title.indexOf(searchTitle) >= 0)
        );
      }}>搜索标题</button
    >
  </div>
  <div>
    <input type="text" bind:value={searchVideoDesc} />
    <button
      on:click={() => {
        someVideos.set(
          _videos.filter(
            (video) => video.description.indexOf(searchVideoDesc) >= 0
          )
        );
      }}>搜索视频描述</button
    >
  </div>
  <div>
    <input type="text" bind:value={searchRangeDesc} />
    <button
      on:click={() => {
        someVideos.set(
          _videos.filter((video) => {
            let hasRange =
              video.ranges.filter(
                (r) => r.description.indexOf(searchRangeDesc) >= 0
              ).length > 0;
            return hasRange;
          })
        );
      }}>搜索Range描述</button
    >
  </div>
</div>
