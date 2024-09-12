import {authStore} from '../store/store.ts';

const {databaseId,auth} = authStore.getState();

// import {Client} from '@notionhq/client';
// export interface AuthProps {
//   auth: string;
//   databaseId: string;
// }
// const testConnection = (authProps:AuthProps) => {
//   const {auth,databaseId} = authProps;
//   if(!auth || !databaseId){
//     console.log('auth or databaseId is empty');
//     return;
//   }
//   const notion = new Client({auth});
//   return new Promise<void>((resolve,reject)=>{
//     notion.databases.retrieve({ database_id: databaseId }).then(response => {
//       console.log('Connection successful:', response);
//       resolve();
//     }).catch(error => {
//       console.error('Connection failed:', error);
//       reject('连接失败');
//     });
//   })
// }
