const { createSlug } = require('./tools');

module.exports = {
  schema: {
    type: 'object',
    required: [
      'id',
      'code',
      'name',
      'price',
      'weight'
    ],
    properties: {
      id: {
        type: 'string',
        minLength: 1
      },
      code: {
        type: 'string',
        minLength: 1
      },
      name: {
        type: 'string',
        minLength: 3,
      },
      description: {
        type: 'string',
      },
      order: {
        type: 'integer',
      },
      price: {
        type: 'number',
      },
      weight: {
        type: 'number',
      },
      measureUnit: {
        type: 'string',
      },
      carbohydrateAmount: {
        type: 'number',
      },
      carbohydrateFullAmount: {
        type: 'number',
      },
      energyAmount: {
        type: 'number',
      },
      energyFullAmount: {
        type: 'number',
      },
      fatAmount: {
        type: 'number',
      },
      fatFullAmount: {
        type: 'number',
      },
      fiberAmount: {
        type: 'number',
      },
      fiberFullAmount: {
        type: 'number',
      },
      images: {
        type: ['array', 'null'],
        items: [
          {
            type: 'object',
            properties: {
              imageId: {
                type: 'string'
              },
              imageUrl: {
                type: 'string',
              },
              uploadDate: {
                type: 'string'
              }
            },
          },
        ],
      },
    },
  },
  prepare(modifiers){
    return modifiers.map((modifier) => {
      const name = modifier.name.trim();
      const imgUrl = (Array.isArray(modifier.images) && modifier.images.length)
        ? modifier.images[0].imageUrl
        : 'https://frontend.italy.ismart.pro/storage/food/food-05.png';
      return {
        ...modifier,
        name,
        imgUrl,
        iikoId: modifier.id,
        slug: createSlug(name),
      };
    })
  },
  filter(modifiers) {
    return {
      filtered: modifiers,
      nonFiltered: [],
    };
  }
};