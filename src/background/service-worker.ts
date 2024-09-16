import {checkExist, testConnection} from '../utils';

//每次启动时检查是否连接成功
chrome.storage.local.get(['auth', 'databaseId'], (result) => {
  const {auth, databaseId} = result;
  if (!databaseId || !auth) return;
  testConnection({auth, databaseId})
    .then(() => chrome.storage.local.set({isConnect: 1}))
    .catch(() => chrome.storage.local.set({isConnect: 0}));
});

//存储已经查询过的url
const cacheUrl: Map<string, boolean> = new Map();

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'QUERY_NOTION') {
    const {url} = message.payload;
    chrome.storage.local.get(['auth', 'databaseId'], (result) => {
      const {auth, databaseId} = result;
      checkExist({auth, databaseId, url}).then(() => {
        chrome.action.setBadgeText({text: '✔'});
        cacheUrl.set(url, true);
      }).catch(err => {
        chrome.action.setBadgeText({text: ''});
        cacheUrl.set(url, false);
        console.log(err,'err');
      });
    });
    return true;
  }
});

//页面刷新时 查询数据库是否存在
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    queryNotionDatabase(tab.url,true);
  }
});

const queryNotionDatabase = (url: string,onUpdated = false) => {
  chrome.storage.local.get(['isConnect', 'auth', 'databaseId'], (result) => {
    const {isConnect, auth, databaseId} = result;
    if (isConnect !== 1 || !databaseId || !auth || cacheUrl.has(url)) return;
    if(!onUpdated && cacheUrl.has(url) && cacheUrl.get(url)){
      chrome.action.setBadgeText({text: '✔'});
      return;
    }
    checkExist({auth, databaseId, url}).then(() => {
      chrome.action.setBadgeText({text: '✔'});
      cacheUrl.set(url, true);
    }).catch(err=>{
      console.log(err,'err');
      cacheUrl.set(url, false);
      chrome.action.setBadgeText({text: ''});
    });
  });
};

//切换tab时 查询缓存信息 若无则查询数据库
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      console.log(`Tab switched to: ${tab.url}`);
      // 在这里执行你需要的操作，例如查询 Notion 数据库
      queryNotionDatabase(tab.url);
    }
  });
});
