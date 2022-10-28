'use strict';

/**
 * all-product service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::all-product.all-product');
