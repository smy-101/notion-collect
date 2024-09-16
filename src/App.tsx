import React, {useEffect, useState} from 'react';
import {Button, Col, Form, Input, message, Row} from 'antd';
import {useStore} from './store';
import {NotionClient, testConnection} from './utils';

function App() {
  const [form] = Form.useForm();
  const {notionClient, setNotionClient} = useStore();

  const [url, setUrl] = useState('');
  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };
  const [title, setTitle] = useState('');
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const activeTab = tabs[0];
      const activeTabUrl = activeTab.url ?? '';
      setUrl(activeTabUrl);
      setTitle(activeTab.title ?? '');
    });
  }, []);

  const [description, setDescription] = useState('');
  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const [tag1, setTag1] = useState('');
  const onTag1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag1(e.target.value);
  };
  const [tag2, setTag2] = useState('');
  const onTag2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag2(e.target.value);
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
          {name: tag1},
          {name: tag2},
        ],
      },
    };
    notionClient?.addData(data).then(()=>{
      message.success('添加成功');
      chrome.action.setIcon({path: 'collected_16.png'});
    }).catch(err=>message.error(err));
  };

  const onSetUp = () => {
    const auth = form.getFieldValue('auth');
    const databaseId = form.getFieldValue('databaseId');
    if (!auth || !databaseId) {
      message.info('auth和databaseId不能为空');
      return;
    }
    testConnection({auth, databaseId})
      .then(()=>{
        chrome.storage.local.set({auth, databaseId, isConnect: '1'});
        setNotionClient(new NotionClient(auth, databaseId));
      })
      .catch(err=>{
        message.error(err);
        chrome.storage.local.set({isConnect: '0'});
        setNotionClient(undefined);
      });
  };

  useEffect(() => {
    chrome.storage.local.get(['auth', 'databaseId', 'isConnect'], (result) => {
      const {auth, databaseId, isConnect} = result;
      if (isConnect === 1) {
        setNotionClient(new NotionClient(auth, databaseId));
        form.setFieldsValue({auth, databaseId});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <Form form={form} size='small'>
        <Row>
          <Col span={24}>
            <Form.Item label="auth" name="auth">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="databaseId" name="databaseId">
              <Input/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button onClick={onSetUp}>设置</Button>
          </Col>
        </Row>
      </Form>
      <div>
        <input value={url} onChange={onUrlChange} placeholder="url"/>
      </div>
      <div>
        <input value={title} onChange={onTitleChange} placeholder="title"/>
      </div>
      <div>
        <input value={description} onChange={onDescriptionChange} placeholder="description"/>
      </div>
      <div>
        <input value={tag1} onChange={onTag1Change} placeholder="tag1"/>
        <input value={tag2} onChange={onTag2Change} placeholder="tag2"/>
      </div>
      <div>
        <button onClick={add}>添加数据</button>
        {/*<button onClick={test}>测试</button>*/}
        {/*<button onClick={test2}>测试2</button>*/}
      </div>
    </>
  );
}

export default App;
