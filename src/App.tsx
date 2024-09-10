import { useState } from 'react'
import './App.css'

function App() {
  const [value, setValue] = useState('');

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  };

  const onSave = () => {
    console.log(chrome, 'chrome')
    console.log(chrome.storage, 'chrome.storage');
    chrome.storage.local.set({ token: value }, () => {
      console.log('Value is set to ' + value);
    });
  };

  const onLoad = () => {
    chrome.storage.local.get(['token'], (result) => {
      console.log('Value1 currently is ' + result.token);
    });
  }

  return (
    <>
      <input value={value} onChange={onInputChange} />
      <button onClick={onSave}>存储数据</button>
      <button onClick={onLoad}>读取数据1</button>
    </>
  )
}

export default App
