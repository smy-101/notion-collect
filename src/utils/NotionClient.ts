import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints';
import {Client} from '@notionhq/client';

export class NotionClient{
  protected notion:Client;
  protected databaseId: string;
  public loading: boolean;

  constructor(auth:string,databaseId:string){
    this.notion = new Client({auth});
    this.databaseId = databaseId;
    this.loading = false;
  }

  public addData(properties:CreatePageParameters['properties']){
    return new Promise((resolve,reject) => {
      this.loading = true;
      this.notion!.pages.create({
        parent: { database_id: this.databaseId! },
        properties,
      })
        .then(response => resolve(response))
        .catch(err=>reject(err))
        .finally(()=>this.loading = false);
    })
  }

  public deleteData(pageId:string){
    return new Promise((resolve,reject) => {
      this.loading = true;
      this.notion!.pages.update({
        page_id: pageId,
        archived: true,
      })
        .then(response => resolve(response))
        .catch(err=>reject(err))
        .finally(()=>this.loading = false);
    })
  }

  public updateData(pageId:string,properties:CreatePageParameters['properties']){
    return new Promise((resolve,reject) => {
      this.loading = true;
      this.notion!.pages.update({
        page_id: pageId,
        properties,
      })
        .then(response => resolve(response))
        .catch(err=>reject(err))
        .finally(()=>this.loading = false);
    })
  }

  public isExist(url:string){
    return new Promise((resolve,reject) => {
      this.loading = true;
      this.notion!.databases.query({
        database_id: this.databaseId!,
        filter: {
          property: "URL",
          url: {
            equals: url,
          }
        }
      })
        .then(response => resolve(response))
        .catch(err=>reject(err))
        .finally(()=>this.loading = false);
    })
  }


}
