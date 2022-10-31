'use strict';

/**
 * sub-catagory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::sub-catagory.sub-catagory');
// ,({strapi})=>({
//     async find(ctx){
//         try {
//             ctx.query = { ...ctx.query, local: 'en' };
//             const { data, meta } = await super.find(ctx);
//             const newData = data.map((data)=>{
//                 return {
//                     "id" : data.id,
//                     "name" : data.attributes.name,
//                     "subCatagoryID":  data?.attributes?.subCatagoryID,
//                     "catagories" : data?.attributes?.catagories?.data.map((data)=>{
//                         return {
//                             "id" : data?.id,
//                             "name" : data?.attributes?.name,
//                         }
//                     })
//                 }
//             })
//             return {newData , meta}      
//         } catch (error) {
//             ctx.body = error
//         }
//     }
// })
