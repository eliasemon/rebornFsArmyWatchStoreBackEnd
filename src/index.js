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
        variantsId : Int,
        product_quantity : Int
      }
      input registerInputFiled{
        username : String,
        email : String,
        password : String,
        phoneNumber : String,
        gender : String
      }

      type orderItemReturn {
        isSuccesfull : Boolean
        message : String
        ordersInformation : OrderEntityResponse
      }

      type Mutation {
        MakeOrder(ordersItem : [orderItemInput]): orderItemReturn
      }

      type userEntity{
        id:ID,
        username : String,
        email: String,
        confirmed: Boolean,
        blocked : Boolean,
        createdAt: Date,
        phoneNumber :String,
        gender: String,
        dataOfBirth : Date,                            
      }
      type registerResponseItem {
        jwt : String
        user : userEntity
      }

      type Mutation {
        userReg(input : registerInputFiled) : registerResponseItem
      }
      
      `,
      resolvers: {
        Mutation : {
          userReg : {
            resolve : async (parent, args, context) =>{
              const { toEntityResponse } = strapi.service(
                "plugin::graphql.format"
              ).returnTypes;
              const params = JSON.parse(JSON.stringify(args))
              params.input.confirmed = true;
              params.input.role= 1
              params.input.blocked =  false
              params.input.jwt = true 
              
              let user = await strapi.service("plugin::users-permissions.user").add(params.input)
              // let user = await strapi.services.profile.create(params.input)
              
              const usersJwt = await strapi.plugin('users-permissions').service('jwt').issue({ id : user.id });
              const resdata = {
                jwt : usersJwt,
                user : {...user}
              }
              return resdata;
            }
          },

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
        "Mutation.userReg": {
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
