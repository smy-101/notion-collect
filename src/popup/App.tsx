import {EditForm} from './components/EditForm.tsx';
import {useEffect, useState} from 'react';
import {Button} from 'antd';

function App() {
  const [isConnect,setIsConnect] = useState(false);

  useEffect(()=>{
    chrome.storage.local.get(['isConnect'], (result) => {
      const {isConnect} = result;
      setIsConnect(isConnect === 1);
    });
  },[]);

  const setAuth = () => {
    chrome.runtime.openOptionsPage();
  };

  return <div style={{width:'600px',height:'300px'}}>
    {isConnect ? <EditForm/> : <>
      <Button onClick={setAuth} type='primary'>设置auth和databaseId</Button>
    </>}
  </div>
}

export default App;
