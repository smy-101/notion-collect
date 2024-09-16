import {Client} from '@notionhq/client';

type Props = {
  auth:string;
  databaseId:string;
};

export const testConnection = (props:Props) => {
  const {auth,databaseId} = props;
  return new Promise<void>((resolve,reject)=>{
    if (!auth || !databaseId){
      reject('auth or databaseId is empty');
      return;
    }
    const notion = new Client({auth});
    notion.databases.retrieve({ database_id: databaseId }).then(response => {
      console.log('Connection successful:', response);
      resolve();
    }).catch(error => {
      console.error('Connection failed:', error);
      reject('连接失败');
    });
  })
};
