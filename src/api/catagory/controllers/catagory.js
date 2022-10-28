'use strict';

/**
 * catagory controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::catagory.catagory',({strapi})=>({
    async find(ctx){
        try {
            ctx.query = { ...ctx.query, local: 'en' , populate : "*"};
            console.log(ctx.query)
            const { data , meta } = await super.find(ctx);
            const newData = data.map((data)=>{
                return {
                    "id" : data.id,
                    "name" : data.attributes.name,
                    "catagoryId":  data?.attributes?.catagoryId,
                    "sub_catagories" : data.attributes?.sub_catagories?.data.map((data)=>{
                        return {
                            "id" : data?.id,
                            "name" : data?.attributes?.name,
                            "subCatagoryID":  data?.attributes?.subCatagoryID,
                        }
                    })
                }
            })
            return { data : newData , meta}      
        } catch (error) {
            ctx.body = error
        }
    }
}));
