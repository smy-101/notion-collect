import { Client } from '@notionhq/client';

const notion = new Client({
  auth: 'xxxx'
});

// 示例函数：获取数据库中的页面
export async function getDatabasePages(databaseId: string) {
  try {
    const response = await notion.databases.query({ database_id: databaseId });
    console.log(response, 'response')
    return response.results;
  } catch (error) {
    console.error('Error fetching database pages221:', error);
    console.error('Error fetching database pages221:', error);
    throw error;
  }
}
