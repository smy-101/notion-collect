import {Button, Flex, Form, FormProps, Input, message} from 'antd';
import {useEffect} from 'react';
import {NotionClient} from '../utils';
import {useStore} from '../store';

type Response = {status:'success' | 'fail',message?:string};

type FieldType = {
  auth?: string;
  databaseId?: string;
};

const AuthForm = () => {
  const {setNotionClient} = useStore();
  const [form] = Form.useForm();

  const onFinish:FormProps<FieldType>['onFinish'] = (values) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    chrome.runtime.sendMessage({ type: 'connect', payload: values }, (response: Response) => {
      if(response.status === 'success'){
        message.success('连接成功!');
        setNotionClient(new NotionClient(values.auth!, values.databaseId!));
      }else{
        message.error('连接失败!');
      }
    });
  };

  useEffect(()=>{
    chrome.storage.local.get(['auth', 'databaseId', 'isConnect'], (result) => {
      const {auth, databaseId, isConnect} = result;
      if (isConnect === 1) {
        setNotionClient(new NotionClient(auth, databaseId));
        form.setFieldsValue({auth, databaseId});
      }
    });
  },[setNotionClient,form]);

  return <>
    <Form form={form} size='small' onFinish={onFinish}>
      <Flex vertical>
        <Form.Item label="auth" name="auth" rules={[{ required: true, message: '请填写auth' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="databaseId" name="databaseId" rules={[{ required: true, message: '请填写databaseId' }]}>
          <Input/>
        </Form.Item>
        <Button onClick={form.submit}>设置</Button>
      </Flex>
    </Form>
  </>
};

export {AuthForm};
