import {Client} from '@notionhq/client';

type Props = {
  auth: string;
  databaseId: string;
  url: string;
}

export const checkExist = (props:Props) => {
  const {auth,databaseId,url} = props;
  return new Promise<void>((resolve,reject) => {
    if (!auth || !databaseId){
      reject('auth or databaseId is empty');
      return;
    }
    const notion = new Client({auth});
    notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "URL",
        url: {equals: url},
      },
    }).then(()=>resolve()).catch(err=>reject(err));
  })
};
