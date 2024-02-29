console.log("[my-crx background.js]");

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}

async function dynamicBlockSites(currentURL) {
  // if (currentURL.includes("zhihu")) {

  // }
  let rules = await chrome.declarativeNetRequest.getDynamicRules([1]);
  console.log("[debug rules]", rules);
}

// Fires when the active tab in a window changes.
chrome.tabs.onActivated.addListener(async function () {
  let currentURL = await getTab();
  console.log("[my-crx tabs.onActivated ]" + currentURL);
});

// Fired when a tab is updated.
chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  // chrome.tabs.onCreated.addListener(async function (tab) {
  //   let currentURL = await getTab();
  console.log("[my-crx tabs.onUpdated ]", tabId, changeInfo, tab);
  //   console.log("[my-crx tabs.onCreated ]", tab);
  //   return;
  //   await dynamicBlockSites(currentURL);

  // Get arrays containing new and old rules
  //   const newRules = await getNewRules();
  const newRules = [
    {
      id: 1,
      priority: 1,
      action: {
        type: "block",
      },
      condition: {
        urlFilter: "bilibili",
        resourceTypes: ["main_frame"],
      },
    },
  ];

  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map((rule) => rule.id);
  //   console.log("[debug oldRuleIds]", oldRuleIds);

  if (changeInfo?.status === "loading" && tab?.url?.includes("bilibili")) {
    console.log("[debug 监测到]", changeInfo.url);
    if (Math.random() < 0.5) {
      console.log("[debug 随机屏蔽]");
      if (
        oldRules
          .map((rule) => rule?.condition?.urlFilter?.indexOf("bilibili") >= 0)
          .includes(true)
      ) {
        console.log("[debug rules中已经存在]", oldRules);
      } else {
        // Use the arrays to update the dynamic rules
        await chrome.declarativeNetRequest.updateDynamicRules({
          // removeRuleIds: oldRuleIds,
          addRules: newRules,
        });
        console.log("[debug rules新增]");
      }
    } else {
      console.log("[debug 随机允许]");
      if (
        oldRules
          .map((rule) => rule?.condition?.urlFilter?.indexOf("bilibili") >= 0)
          .includes(true)
      ) {
        console.log("[debug rules中已经存在]", oldRules);
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [1],
          // addRules: newRules,
        });
        console.log("[debug rules删除]");
      }
    }
  }
});
