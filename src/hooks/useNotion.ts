import {Client} from '@notionhq/client';
import {useState} from 'react';
import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints';

type Props = {
  auth:string;
  databaseId:string;
};

export const useNotion = (props:Props) => {
  const {auth,databaseId} = props;
  //创建notion客户端
  const notion = new Client({auth});
  const [loading,setLoading] = useState(false);

  //添加数据到数据库
  const addData = async (properties:CreatePageParameters['properties']) => {
    setLoading(true);
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties,
    });
    setLoading(false);
    console.log(response,'response');
    return response;
  };

  //删除数据库中的页面
  const deleteData = async (pageId:string) => {
    setLoading(true);
    const response = await notion.pages.update({
      page_id: pageId,
      archived: true,
    });
    setLoading(false);
    console.log(response,'response');
    return response;
  };

  //更新数据库中的页面
  const updateData = async (pageId:string,properties:CreatePageParameters['properties']) => {
    setLoading(true);
    const response = await notion.pages.update({
      page_id: pageId,
      properties,
    });
    setLoading(false);
    console.log(response,'response');
    return response;
  };

  //查询是否存在某个页面
  const isExist = async (url:string) => {
    setLoading(true);
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "URL",
        url: {
          equals: url,
        }
      }
    });
    setLoading(false);
    console.log(response,'response');
    return response;
  };

  return {
    addData,
    deleteData,
    updateData,
    isExist,
    loading,
  };

};
