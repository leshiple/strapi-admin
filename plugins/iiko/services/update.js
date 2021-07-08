const updateService = require('./nomenclature');
const { validate } = require('../utils/tools');
const product = require('../utils/product');
const category = require('../utils/category');
const modifier = require('../utils/modifier');

module.exports = {
  async update({ updateImage= false }) {
    const { categories, products, modifiers, groupModifiers } = await updateService.getNomenclature();

    console.log('=======================');
    console.log('categories');
    console.log('=======================');
    const categoriesResult = await this.updateEntries({
      updateImage,
      entries: categories,
      collectionType: 'categories',
      relatedEntries: { products },
    });
    console.log('=======================');
    console.log('modifiers');
    console.log('=======================');
    const modifiersResult = await this.updateEntries({
      updateImage,
      entries: modifiers,
      collectionType: 'modifiers',
    });
    console.log('=======================');
    console.log('modifiers');
    console.log('=======================');
    const productsResult = await this.updateEntries({
      updateImage,
      entries: products,
      collectionType: 'products',
      relatedEntries: {
        groupModifiers,
        categories: categoriesResult.normal.ids,
        modifiers: modifiersResult.normal.ids,
      }
    });

    return {
      categories: categoriesResult,
      modifiers: modifiersResult,
      products: productsResult,
    };
  },
  async updateEntries({ entries, collectionType, relatedEntries, updateImage }) {
    const { schema, prepare, filter } = this.map(collectionType);
    const { valid, nonValid } = validate(entries, schema);
    const { filtered, nonFiltered } = filter(valid, relatedEntries);
    const normalizedEntries = prepare(filtered, relatedEntries);
    const { created, updated, ids } = await this.updateOrCreateEntries(normalizedEntries, collectionType, updateImage);

    return {
      normal: {
        created,
        updated,
        ids,
      },
      broken: [...nonValid, ...nonFiltered],
    };
  },

  map(collectionType) {
    const types = {
      products: {
        filter: product.filter,
        schema: product.schema,
        prepare: product.prepare,
      },
      categories: {
        filter: category.filter,
        schema: category.schema,
        prepare: category.prepare,
      },
      modifiers: {
        filter: modifier.filter,
        schema: modifier.schema,
        prepare: modifier.prepare,
      },
    };
    return types[collectionType];
  },

  async updateOrCreateEntries(entries, collectionType, updateImage) {
    const created = [];
    const updated = [];
    const ids = {};

    for (const entry of entries) {
      const existsEntry = await this.findEntry(entry.iikoId, collectionType);

      if (updateImage || !existsEntry) {
        entry.img = await this.uploadImage(entry.slug, entry.imgUrl);
      }

      if (existsEntry) {
        console.log('=======================');
        console.log('update');
        console.log('=======================');
        entry.active = existsEntry.active;
        const updatedEntry = await this.updateEntry(entry, collectionType);
        ids[updatedEntry.iikoId] = updatedEntry.id;
        updated.push(updatedEntry);
        console.log(updatedEntry.iikoId, updatedEntry.name);
      } else {
        console.log('=======================');
        console.log('create');
        console.log('=======================');
        const createdEntry = await this.createEntry(entry, collectionType);
        ids[createdEntry.iikoId] = createdEntry.id;
        created.push(createdEntry);
        console.log(createdEntry.iikoId, createdEntry.name);
      }
    }

    return {
      updated,
      created,
      ids,
    };
  },

  async findEntry(iikoId, collectionType) {
    return strapi.services[collectionType].findOne({
      iikoId,
    });
  },

  async updateEntry(entry, collectionType) {
    return strapi.services[collectionType].update({
      iikoId: entry.iikoId,
    }, entry);
  },
  async createEntry(entry, collectionType) {
    return strapi.services[collectionType].create(entry);
  },

  async uploadImage(slug, url) {
    const img = await strapi.plugins.uploader.services.uploader.index({
      name: slug,
      url: url,
    });
    return img.id;
  }
}