<script>
  import TimeRangeItem from "./TimeRangeItem.svelte";
  import { videos } from "../stores";
  export let video;
  export let videoData;
  $: videoId = videoData.id;
  let toAdd = null;
</script>

<div>
  {#if !toAdd}
    <div><button on:click={() => (toAdd = true)}>新增</button></div>
  {:else}
    <div>
      <TimeRangeItem
        editFlag={true}
        {video}
        id={Date.now().toString()}
        start={video.currentTime}
        end={null}
        description={null}
        on:save={(event) => {
          videos.update((data) => {
            let newData = data.map((_videoData) => {
              if (_videoData.id === videoId) {
                _videoData.ranges.push(event.detail);
                return _videoData;
              } else {
                return _videoData;
              }
            });
            return newData;
          });
          toAdd = false;
        }}
        on:cancel={() => (toAdd = false)}
      ></TimeRangeItem>
    </div>
  {/if}
</div>
<div>
  {#each videoData.ranges as item, index (item.id)}
    <TimeRangeItem
      {video}
      id={item.id}
      start={item.start}
      end={item.end}
      description={item.description}
      on:save={(event) => {
        let newRange = event.detail;
        videos.update((data) => {
          let newData = data.map((videoData) => {
            if (videoData.id === videoId) {
              videoData.ranges = videoData.ranges.map((range) => {
                if (range.id === newRange.id) {
                  return newRange;
                } else {
                  return range;
                }
              });
              return videoData;
            } else {
              return videoData;
            }
          });
          return newData;
        });
      }}
      on:delete={(event) => {
        console.log("[delete]");
        let toDelteRangeId = event.detail;
        videos.update((data) => {
          let newData = data.map((videoData) => {
            if (videoData.id === videoId) {
              videoData.ranges = videoData.ranges.filter(
                (range) => range.id !== toDelteRangeId
              );
              return videoData;
            } else {
              return videoData;
            }
          });
          return newData;
        });
      }}
    ></TimeRangeItem>
  {/each}
</div>
