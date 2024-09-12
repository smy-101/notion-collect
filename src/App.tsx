import React, {useEffect, useState} from 'react';
import {useNotion} from './hooks';
import {useAuthStore} from './store/store.ts';

function App() {
  const [auth, setAuth] = useState('');
  const [databaseId,setDatabaseId] = useState('');

  const {setAuthAndDatabaseId,auth:auth2,databaseId:database} = useAuthStore();

  const onAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(e.target.value)
  };

  const onAuthSave = () => {
    chrome.storage.local.set({ auth: auth }, () => {
      console.log('Value is set to ' + auth);
    });
  };

  const onDatabaseIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatabaseId(e.target.value)
  };

  const onDatabaseIdSave = () => {
    chrome.storage.local.set({ databaseId: databaseId }, () => {
      console.log('Value is set to ' + databaseId);
    });
  };

  useEffect(()=>{
    chrome.storage.local.get(['auth','databaseId'], function(result) {
      setAuth(result.auth);
      setDatabaseId(result.databaseId);
    });
  },[])

  const {addData} = useNotion({auth,databaseId});

  const [url,setUrl] = useState('');
  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  };
  const [title,setTitle] = useState('');
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const activeTab = tabs[0];
      const activeTabUrl = activeTab.url ?? '';
      setUrl(activeTabUrl);
      setTitle(activeTab.title ?? '');
    });
  }, []);

  const [description,setDescription] = useState('');
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  };

  const [tag1,setTag1] = useState('');
  const onTag1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag1(e.target.value)
  };
  const [tag2,setTag2] = useState('');
  const onTag2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag2(e.target.value)
  };

  // const [isUpdate,setIsUpdate] = useState(false);
  const add = () => {
    const data = {
      Name: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      '描述': {
        rich_text: [
          {
            text: {
              content: description,
            },
          },
        ],
      },
      URL: {
        url: url,
      },
      Tags: {
        multi_select: [
          { name: tag1 },
          { name: tag2 },
        ],
      },
    };

    addData(data)
  };

  const test = () => {
    setAuthAndDatabaseId('1','2');
  };

  const test2 = () => {
    console.log(auth2,database,'=====================');
  };

  return (
    <>
      <div>
        <input value={auth} onChange={onAuthChange} placeholder="auth"/>
        <button onClick={onAuthSave}>存储Auth</button>
      </div>
      <div>
        <input value={databaseId} onChange={onDatabaseIdChange} placeholder="databaseId"/>
        <button onClick={onDatabaseIdSave}>存储DatabaseId</button>
      </div>
      <div>
        <input value={url} onChange={onUrlChange} placeholder='url'/>
      </div>
      <div>
        <input value={title} onChange={onTitleChange} placeholder='title'/>
      </div>
      <div>
        <input value={description} onChange={onDescriptionChange} placeholder='description'/>
      </div>
      <div>
        <input value={tag1} onChange={onTag1Change} placeholder='tag1'/>
        <input value={tag2} onChange={onTag2Change} placeholder='tag2'/>
      </div>
      <div>
        <button onClick={add}>添加数据</button>
        <button onClick={test}>测试</button>
        <button onClick={test2}>测试2</button>
      </div>
    </>
  )
}

export default App
