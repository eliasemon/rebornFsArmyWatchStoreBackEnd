'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.service("plugin::graphql.extension");

    extensionService.use(({ strapi }) => ({
      typeDefs: `
      input orderItemInput {
        product_ref : Int,
        variantsId : Int
      }
      type orderItemReturn {
        product_ref : Int,
        variantsId : Int
      }
      type Mutation {
        MakeOrder(ordersItem : [orderItemInput]): OrderEntityResponse
      }
      
      `,
      resolvers: {
        Mutation : {
          MakeOrder : {
            resolve : async (parent, args, context) => {
              const { toEntityResponse } = strapi.service(
                "plugin::graphql.format"
              ).returnTypes;
              const params= {}
              params.data = JSON.parse(JSON.stringify(args))
              const resdata = await strapi.services["api::order.order"].create(params);
              const response = toEntityResponse(resdata);
              return response;
            }
          }
        }
      },
      resolversConfig: {
        "Mutation.MakeOrder": {
          auth: false,
        },
      },
    }));
    
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *_____
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
