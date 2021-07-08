const { createSlug } = require('./tools');

module.exports = {
  schema: {
    type: 'object',
    required: [
      'id',
      'code',
      'name',
      'price',
      'weight',
      'parentGroup',
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
        // minItems: 0,
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
          }
        ],
      },
      groupModifiers: {
        type: ['array', 'null'],
        minItems: 0,
        items: {
          type: 'object',
          properties: {
            maxAmount: {
              type: 'integer',
            },
            minAmount: {
              type: 'integer',
            },
            modifierId: {
              type: 'string',
            },
            required: {
              type: 'boolean'
            },
            childModifiers: {
              type: ['array', 'null'],
              minItems: 1,
              items: {
                type: 'object',
                properties: {
                  maxAmount: {
                    type: 'integer',
                  },
                  minAmount: {
                    type: 'integer',
                  },
                  modifierId: {
                    type: 'string',
                  },
                  required: {
                    type: 'boolean',
                  },
                  defaultAmount: {
                    type: 'integer',
                  },
                  hideIfDefaultAmount: {
                    type: 'boolean',
                  },
                },
              },
            },
          },
        },
      },
      parentGroup: {
        type: 'string',
        minLength: 3,
      },
      type: {
        type: 'string',
      },
    },
  },
  prepare(products, { categories, modifiers, groupModifiers }){
    return products.map((product) => {
      const name = product.name.trim();
      const imgUrl = (Array.isArray(product.images) && product.images.length)
        ? product.images[0].imageUrl
        : 'https://frontend.italy.ismart.pro/storage/food/food-05.png';


      product.groupModifiers.map((group) => {
        const currentGroup = groupModifiers.find((g) => g.id === group.modifierId);
        if (currentGroup) {
          group.name = currentGroup.name;
        }

        if (Array.isArray(group.childModifiers)) {
          group.childModifiers.forEach((mod) => {
            mod.modifier = modifiers[mod.modifierId];
          })
        } else {
          group.childModifiers = [];
        }

        return group;
      })


      return {
        ...product,
        name,
        imgUrl,
        active: true,
        iikoId: product.id,
        category: categories[product.parentGroup],
        slug: createSlug(name)
      };
    })
  },
  filter(products){
    return products.reduce((acc, product) => {
      const isDuplicate = acc.filtered.find((p) => (
        createSlug(p.name.trim()) === createSlug(product.name.trim())
      ));

      if (isDuplicate) {
        acc.nonFiltered.push({
          data: product,
          errors: [{
            keyword: 'duplicate',
            message: 'this is a duplicate'
          }]
        });
        return acc;
      }

      acc.filtered.push(product);
      return acc;
    }, {
      filtered: [],
      nonFiltered: [],
    });
  },
};