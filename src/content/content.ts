console.log('this is content page')
console.log('this is content page')

const url = window.location.href;
//查询当前页面是否存在于数据库中
chrome.storage.local.get(['isConnect'], (result) => {
  if(result.isConnect === 1){
    chrome.runtime.sendMessage({type:'QUERY_NOTION',payload:{url}});
  }
})
