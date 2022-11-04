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
        isSuccesfull : Boolean
        message : String
        ordersInformation : OrderEntityResponse
      }
      type Mutation {
        MakeOrder(ordersItem : [orderItemInput]): orderItemReturn 
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
              const gqlResponse = toEntityResponse(resdata);
              const response = {}
              response.ordersInformation = gqlResponse
              if(resdata.error || !resdata.id || !resdata.id == null){
                response.isSuccesfull = false
                response.message = "Unsuccesful Create order attemp || Some Fields are missing"
                return response;
              }
              response.message = "Order Created SuccessFully"
              response.isSuccesfull = true
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
