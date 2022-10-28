'use strict';

/**
 * extra-cost service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::extra-cost.extra-cost');
