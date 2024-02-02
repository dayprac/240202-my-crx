<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let video;
  export let id, start, end, description;
  export let editFlag = false;

  const formatSeconds = (s) => {
    if (s === null || s === undefined) {
      return "🈚️";
    } else {
      return [parseInt(s / 60 / 60), parseInt((s / 60) % 60), parseInt(s % 60)]
        .join(":")
        .replace(/\b(\d)\b/g, "0$1");
    }
  };
</script>

{#if !editFlag}
  <div class="text-xs">
    <div class="flex items-center">
      <button
        class="mr-1"
        on:click={() => {
          video.currentTime = start;
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
          />
        </svg>
      </button>

      <span>{description}</span>
    </div>

    <div class="flex items-center ml-7">
      <span>{formatSeconds(start)} - {formatSeconds(end)}</span>
      <button
        class="ml-3"
        on:click={() => {
          dispatch("delete", id);
        }}>删除</button
      >
      <button
        class="ml-3"
        on:click={() => {
          editFlag = true;
        }}>编辑</button
      >
    </div>
  </div>
{:else}
  <div>
    <div class="flex">
      <div><input type="number" step="1" bind:value={start} /></div>
      <div>
        <button on:click={() => (start = video.currentTime)}>此刻</button>
      </div>
    </div>
    <div class="flex">
      <div><input type="number" step="1" bind:value={end} /></div>
      <div>
        <button on:click={() => (end = video.currentTime)}>此刻</button>
      </div>
    </div>
    <div class="flex">
      <div><input type="text" bind:value={description} /></div>
    </div>
    <div>
      <button
        on:click={() => {
          dispatch("save", { id, start, end, description });
          editFlag = false;
        }}>保存</button
      >
      <button
        on:click={() => {
          dispatch("cancel");
          editFlag = false;
        }}>放弃</button
      >
    </div>
  </div>
{/if}
