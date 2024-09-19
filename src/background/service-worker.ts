import {debounce, NotionClient, testConnection} from '../utils';

type Message = {type:'connect',payload:{auth:string,databaseId:string}};
type SendResponse = (data:{status:'success' | 'fail',message?:string})=>void;

let notion:NotionClient | undefined = undefined;
let isConnect: 0 | 1 = 0;
chrome.storage.local.get('isConnect', (result) => {
  isConnect = result?.isConnect ?? 0;
});
chrome.action.setBadgeBackgroundColor({color:'blue'});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "settings",
    title: "扩展设置",
    contexts: ["action"]
  });
});

const tryConnect = (authProps:{auth:string,databaseId:string}) => {
  const {auth, databaseId} = authProps;
  return new Promise<void>((resolve, reject)=>{
    if(!auth || !databaseId) {
      reject('auth or databaseId is empty');
      return;
    }
    testConnection({auth,databaseId})
      .then(() => {
        isConnect = 1;
        chrome.storage.local.set({isConnect: 1,auth,databaseId});
        notion = new NotionClient(auth, databaseId);
        resolve();
      })
      .catch(() => {
        if(isConnect === 0){
          isConnect = 0;
          chrome.storage.local.set({isConnect: 0});
          reject('连接失败');
        }
      });
  })
};

//每次启动时检查是否连接成功
chrome.storage.local.get(['auth', 'databaseId'], (result) => {
  const {auth, databaseId} = result;
  tryConnect({auth, databaseId}).catch(err=>{console.log(err);})
});

//type为connect时 尝试连接数据库 成功则设置isConnect为1 失败则设置为0 更新notion
chrome.runtime.onMessage.addListener((message:Message, _sender, sendResponse:SendResponse) => {
  const {type, payload} = message;
  if(type === 'connect'){
    const {auth, databaseId} = payload;
    tryConnect({auth, databaseId})
      .then(()=>sendResponse({status: 'success'}))
      .catch(err=>sendResponse({status: 'fail', message: err}));
  }
  return true;
});

const queryNotionDatabase = (url: string) => {
  if(notion === undefined) return;
  //刷新和切换tab时查询该页面是否还存在于数据库中
  notion.isExist(url)
    .then(pageId => {
      chrome.storage.local.set({pageId,url});
      chrome.action.setBadgeText({text: '✔'});
    })
    .catch(err=>{
      console.log(err);
      chrome.storage.local.set({pageId:'',url:''});
      chrome.action.setBadgeText({text: ''});
    });
};

const debouncedQueryNotionDatabase = debounce(queryNotionDatabase, 1000 * 60 * 5);

//页面刷新时 查询数据库是否存在
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) debouncedQueryNotionDatabase(tab.url);
});

//切换tab时 查询缓存信息 若无则查询数据库
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if(tab.url) debouncedQueryNotionDatabase(tab.url);
  });
});
