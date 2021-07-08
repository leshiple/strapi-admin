'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const path = require('path');
const nunjucks = require('nunjucks');
const categoriesData = require('../../../temp/categories.json');
const modifiersData = require('../../../temp/modifiers.json');
const productsData = require('../../../temp/products.json');

nunjucks.configure(path.resolve('src/templates'), { autoescape: true });

module.exports = {
  async menu(ctx) {
    const categoriesPairs = {};
    const modifierPairs = {};
    for (const cat of categoriesData) {
    await strapi.services.categories.delete({
      iiko_id: cat.id,
    })

      cat.iiko_id = cat.id;
      const entity = await strapi.services.categories.create(cat);
      categoriesPairs[cat.id] = entity.id;
    }

    for (const mod of modifiersData) {
      await strapi.services.modifiers.delete({
        iiko_id: mod.id,
      })
      mod.iiko_id = mod.id
      const entity = await strapi.services.modifiers.create(mod);
      modifierPairs[mod.id] = entity.id;
    }

    for (const product of productsData) {
      await strapi.services.products.delete({
        iiko_id: product.id,
      });
      product.category = categoriesPairs[product.category.id];
      product.iiko_id = product.id;

      product.groupModifiers.forEach((group) => {
        group.childModifiers = group.childModifiers.map((mod) => modifierPairs[mod]);
      })

      const image = await strapi.plugins.uploader.services.uploader.index({
        id: product.id,
        name: product.slug,
        url: product.image,
      });

      product.img = image.id;

      await strapi.services.products.create(product);
    }

    return {
      categoriesPairs,
      modifierPairs
    }
  },
};
