"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      let totalPrice = 0;
      const { data } = ctx.request.body;
      const { ordersItem } = data;

    //   || !data.delivaryAddress
      if (!ordersItem ) {
        const error = new Error()
        error.status = 400
        error.message = "validation error . some fields are missing"
        return {
            data : null,
            error
        };
      }
      const forResolvedPromise = ordersItem.map(async (item) => {
        const rawEntity = await strapi.entityService.findOne(
          "api::all-product.all-product",
          item.product_ref,
          {
            fields : ['productName',"productCode", 'id' , "defualtPrice" ],
            populate: { variants: true },
          }
        );
        
        if(item.variantsId != -1){
          const entity = rawEntity.variants.find((v) => v.id == item.variantsId);
          item.unitPrice = entity.variantPrice;
          item.variantCode = entity.variantCode;
          item.variantColor = entity.color;
        }else{
          item.unitPrice = rawEntity.defualtPrice;
          item.variantColor = "defualt";
          item.variantCode = null;
        }
        item.product_ref = rawEntity.id;
        item.productCode =  rawEntity.productCode;
        item.productName = rawEntity.productName;
        item.productId = rawEntity.id;
        item.product_quantity =
          item.product_quantity && Number(item.product_quantity)
            ? item.product_quantity
            : 1;
        item.itemsTotalPrice = item.unitPrice * item.product_quantity;
        totalPrice = totalPrice + item.itemsTotalPrice;
        return item;
      });

      await Promise.all(forResolvedPromise).then((values) => {
        data.ordersItem = values;
        data["user_ref"] = ctx.state.user.id;
        
      });
      const {shipingCost, vat} = await strapi.entityService.findMany('api::extra-cost.extra-cost')
      data.shipingCost = shipingCost;
      let totalVat = (totalPrice/100) * vat;
      totalPrice = totalPrice + shipingCost + totalVat
      data["shipingCost"] = shipingCost;
      data["vatInPercentages"] = vat;
      data["totalVat"] = totalVat;
      data["totalPrice"] = totalPrice;
      ctx.query = { ...ctx.query, local: "en", populate: "*"};
      const response = await super.create(ctx);
      const forRefineUseRef = response.data.attributes.user_ref.data
      const refinedUserRef = {
         "id" : forRefineUseRef.id,
         "username" : forRefineUseRef.attributes.username,
         "email" : forRefineUseRef.attributes.email,
         "phoneNumber": forRefineUseRef.attributes.phoneNumber
      }
      response.data.attributes.user_ref = refinedUserRef
      return response

    } catch (error) {
      ctx.body = error;
    }
  },
}));
