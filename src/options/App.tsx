import {Button, Flex, Form, FormProps, Input, message} from 'antd';
import {useEffect} from 'react';

type Response = {status:'success' | 'fail',message?:string};
type FieldType = {
  auth?: string;
  databaseId?: string;
};

//options页面暂时设置auth和databaseId  其他相关字段设置这里暂时不做处理 //todo
const App = () => {
  const [form] = Form.useForm();

  const onFinish:FormProps<FieldType>['onFinish'] = (values) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    chrome.runtime.sendMessage({ type: 'connect', payload: values }, (response: Response) => {
      if(response.status === 'success'){
        message.success('连接成功!');
      }else{
        message.error('连接失败!');
      }
    });
  };

  useEffect(()=>{
    chrome.storage.local.get(['auth', 'databaseId', 'isConnect'], (result) => {
      const {auth, databaseId, isConnect} = result;
      if (isConnect === 1) {
        form.setFieldsValue({auth, databaseId});
      }
    });
  },[form]);

  return <>
    <Form form={form} size='small' onFinish={onFinish}>
      <Flex vertical>
        <Form.Item label="auth" name="auth" rules={[{ required: true, message: '请填写auth' }]}>
          <Input/>
        </Form.Item>
        <Form.Item label="databaseId" name="databaseId" rules={[{ required: true, message: '请填写databaseId' }]}>
          <Input/>
        </Form.Item>
        <Button onClick={form.submit} type='primary'>设置</Button>
      </Flex>
    </Form>
  </>
};

export {App};
