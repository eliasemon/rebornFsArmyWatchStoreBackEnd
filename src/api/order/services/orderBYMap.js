// 'use strict';


// /**
//  * order service
//  */

// const { createCoreService } = require('@strapi/strapi').factories;

// module.exports = createCoreService('api::order.order', ({ strapi }) => ({
//     async create(params) {
//         const ctx = strapi.requestContext.get();
//       try {
//         let totalPrice = 0;
//         const { data } = params;
//         const { ordersItem } = data;
//       //   || !data.delivaryAddress
//         if (!ordersItem && ordersItem.length == 0 ) {
//           const error = new Error()
//           error.status = 400
//           error.message = "validation error . some fields are missing"
//           return {
//               data : null,
//               error
//           };
//         }
//         const forResolvedPromise = ordersItem.map(async (item) => {
//           const rawEntity = await strapi.entityService.findOne(
//             "api::all-product.all-product",
//             item.product_ref || -1,
//             {
//               fields : ['productName',"productCode", 'id' , "defualtPrice" ],
//               populate: { variants: true },
//             }
//           );
       
//           let entity;
//           if(item.variantsId != -1){
//              entity = rawEntity.variants.find((v) => v.id == item.variantsId);
//           }

//           if(entity){
//             item.unitPrice = entity?.variantPrice;
//             item.variantCode = entity?.variantCode;
//             item.variantColor = entity?.color;
//           }else{
//             item.unitPrice = rawEntity?.defualtPrice;
//             item.variantColor = "defualt";
//             item.variantCode = null;
//           }
//           item.product_ref = rawEntity?.id;
//           item.productCode =  rawEntity?.productCode;
//           item.productName = rawEntity?.productName;
//           item.productId = rawEntity?.id;
//           item.product_quantity =
//             item.product_quantity && Number(item.product_quantity)
//               ? item.product_quantity
//               : 1;
//           item.itemsTotalPrice = item.unitPrice * item.product_quantity;
//           totalPrice = totalPrice + item.itemsTotalPrice;
//           return item;
//         });
        
//         console.log("Promise=>   ",forResolvedPromise)

//         await Promise.all(forResolvedPromise).then((values) => {
          
//           data.ordersItem = values;
//           data["user_ref"] = ctx.state.user.id;
          
//         });
//         const {shipingCost, vat} = await strapi.entityService.findMany('api::extra-cost.extra-cost')
//         data.shipingCost = shipingCost;
//         let totalVat = (totalPrice/100) * vat;
//         totalPrice = totalPrice + shipingCost + totalVat
//         data["shipingCost"] = shipingCost;
//         data["vatInPercentages"] = vat;
//         data["totalVat"] = totalVat;
//         data["totalPrice"] = totalPrice;
//         params.data =  data
//         params.populate = '*'
//         const response = await super.create(params);
//         const forRefineUseRef = response.user_ref
//         const refinedUserRef = {
//            "id" : forRefineUseRef?.id,
//            "username" : forRefineUseRef?.username,
//            "email" : forRefineUseRef?.email,
//            "phoneNumber": forRefineUseRef?.phoneNumber
//         }
//         response.user_ref = refinedUserRef
//         return response
  
//       } catch (error) {
//         return error
//       }
//     },
//   }));
