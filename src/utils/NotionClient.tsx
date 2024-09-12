// import {Client} from '@notionhq/client';
// import {CreatePageParameters} from '@notionhq/client/build/src/api-endpoints';
//
// type AuthProps = {
//   auth:string;
//   databaseId:string;
// };
//
// class NotionClient {
//   private notion:Client | null = null;
//   private databaseId:string = '';
//   private loading:boolean = false;
//
//   public setUpClient(authProps:AuthProps){
//     const {auth,databaseId} = authProps;
//     if(!auth && !databaseId){
//       console.error('auth and databaseId are required');
//       return;
//     }
//     this.testConnection(authProps).then(result=>{
//       if(result){
//         this.notion = new Client({auth});
//         this.databaseId = databaseId;
//       }
//     })
//   };
//
//   private async testConnection(authProps:AuthProps){
//     const {auth,databaseId} = authProps;
//     const notion = new Client({auth});
//     try {
//       const response = await notion.databases.retrieve({ database_id: databaseId });
//       console.log('Connection successful:', response);
//       return true;
//     } catch (error) {
//       console.error('Connection failed:', error);
//       return false;
//     }
//   }
//
//   public async addData(properties:CreatePageParameters['properties']){
//     this.loading = true;
//     const response = await this.notion!.pages.create({
//       parent: { database_id: this.databaseId },
//       properties,
//     });
//     this.loading = false;
//     console.log(response,'response');
//     return response;
//   }
//
//
// }
