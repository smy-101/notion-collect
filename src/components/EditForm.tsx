import {Button, Flex, Form, FormProps, Input, message} from 'antd';
import {useStore} from '../store';
import {useEffect, useState} from 'react';

type FieldType = {
  url: string;
  title: string;
  description:string;
  tag1:string;
  tag2:string;
};

const EditForm = () => {
  const [form] = Form.useForm();
  const {notionClient} = useStore();

  const onFinish:FormProps<FieldType>['onFinish'] = (values) => {
    const {tag1,tag2,title,description,url} = values;
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
        multi_select: tag2 ? [
          {name: tag1},
          {name: tag2},
        ] : [{name:tag1}],
      },
    };
      notionClient?.addData(data).then(()=>{
        message.success('添加成功');
      }).catch(err=>message.error(err));
  };

  useEffect(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      const activeTab = tabs[0];
      const activeTabUrl = activeTab.url ?? '';
      form.setFieldsValue({url:activeTabUrl,title:activeTab.title ?? ''});
    });
  }, [form]);

  const [pageId,setPageId] = useState('');
  useEffect(()=>{
    chrome.storage.local.get(['pageId'],result=>{
      if(result.pageId){
        setPageId(result.pageId);
      }
    })
  },[]);

  const deleteItem = () => {
    notionClient?.deleteData(pageId)
      .then(()=>message.success('删除成功!'))
      .catch(err=>message.error(err));
  };

  const updateForm = () => {
    form.validateFields().then(values=>{
      const {tag1,tag2,title,description,url} = values;
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
          multi_select: tag2 ? [
            {name: tag1},
            {name: tag2},
          ] : [{name:tag1}],
        },
      };
      notionClient?.updateData(pageId,data)
        .then(()=>message.success('更新成功!'))
        .catch(err=>message.error(err));
    })
  }

  return <>
    <Form form={form} onFinish={onFinish}>
      <Flex vertical>
        <Form.Item label='url' name='url' rules={[{ required: true, message: '请填写url' }]}>
          <Input readOnly/>
        </Form.Item>
        <Form.Item label='title' name='title' rules={[{ required: true, message: '请填写title' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label='description' name='description'>
          <Input/>
        </Form.Item>
        <Form.Item label='tag1' name='tag1' rules={[{ required: true, message: '请填写tag1' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label='tag2' name='tag2'>
          <Input/>
        </Form.Item>
        <Button onClick={form.submit}>添加</Button>
        {pageId && <Button onClick={deleteItem}>删除</Button>}
        {pageId && <Button onClick={updateForm}>更新</Button>}
      </Flex>
    </Form>
  </>
};

export {EditForm};
