//用于右键菜单跳转到options页面

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "settings",
    title: "扩展设置",
    contexts: ["action"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'settings') {
    chrome.runtime.openOptionsPage();
  }
});
