import {debounce, NotionClient, testConnection} from '../utils';

//1.每次启动时尝试连接notion数据库
//2.用户重新设置auth和databaseId时重新连接数据库
//3.为了防止频繁向notion请求，会缓存数据在background中 节流请求
//目前打算是点击tab的情况下不会请求notion  只有在页面刷新的情况下会触发节流请求
type Message = {type:'connect',payload:{auth:string,databaseId:string}} |
  {type:'getDatabase',payload:{url:string}} |
  {type:'deletePage',payload:{url:string,pageId:string}};
type SendResponse = (data:{status:'success' | 'fail',message?:string})=>void;

let notion:NotionClient | undefined = undefined;
let isConnect: 0 | 1 = 0;
chrome.storage.local.get('isConnect', (result) => {
  isConnect = result?.isConnect ?? 0;
});

//eslint-disable-next-line
const cacheUrl = new Map<string,{collected:boolean,properties: Record<string, any>,pageId:string}>();

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
  }else if(type === 'getDatabase'){
    const {url} = payload;
    if(cacheUrl.has(url)){
      const {collected,properties,pageId} = cacheUrl.get(url) as {collected:boolean,properties: Record<string, any>,pageId:string};
      sendResponse({status: 'success',message:JSON.stringify({collected,properties,pageId})});
    }else {
      sendResponse({status: 'fail',message:'no data'});
    }
  }else if(type === 'deletePage'){
    const {url,pageId} = payload;
    notion?.deleteData(pageId)
      .then(()=>{
        sendResponse({status: 'success'});
        cacheUrl.set(url, {pageId:'',collected:false,properties:{}});
      })
      .catch(err=>sendResponse({status: 'fail',message:err}));
  }
  return true;
});

//请求notion 查看网页是否存在于数据库中
const queryNotionDatabase = (url: string) => {
  if(notion === undefined) {
    chrome.action.setBadgeText({text: ''});
    return;
  }
  //刷新和切换tab时查询该页面是否还存在于数据库中
  notion.isExist(url)
    .then(response => {
      const {pageId,properties} = response;
      cacheUrl.set(url, {pageId,collected:true,properties});
      chrome.action.setBadgeText({text: '✔'});
    })
    .catch(err=>{
      console.error(err);
      console.log('捕获错误');
      cacheUrl.set(url, {pageId:'',collected:false,properties:{}});
      chrome.action.setBadgeText({text: ''});
    });
};

//设置5分钟的节流时间
const debouncedQueryNotionDatabase = debounce(queryNotionDatabase, 1000 * 60 * 5);

//页面刷新时 查询数据库是否存在
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = tab.url.split('#')[0];
    if(!cacheUrl.has(url)){
      queryNotionDatabase(url);
    }else {
      debouncedQueryNotionDatabase(url);
    }
  }
});


//切换tab时 先查询缓存中的数据 如果没有再请求notion
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if(tab.url) {
      //url去除掉锚点信息再查询
      const url = tab.url.split('#')[0];
      if (cacheUrl?.get(url)?.collected) {
        chrome.action.setBadgeText({text: '✔'});
      } else {
        if (cacheUrl?.has(url)) {
          chrome.action.setBadgeText({text: ''});
        } else {
          debouncedQueryNotionDatabase(url);
        }
      }
    }
  });
});
