const { createSlug } = require('./tools');

module.exports = {
  schema: {
    type: 'object',
    required: [
      'id',
      'name',
    ],
    properties: {
      id: {
        type: 'string',
        minLength: 1
      },
      name: {
        type: 'string',
        minLength: 3,
      },
      order: {
        type: 'integer',
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
          }
        ],
      },
    },
  },
  prepare(categories){
    return categories.map((category) => {
      const name = category.name.trim();
      const imgUrl = (Array.isArray(category.images) && category.images.length)
        ? category.images[0].imageUrl
        : 'https://frontend.italy.ismart.pro/storage/food/food-05.png';
      return {
        ...category,
        name,
        imgUrl,
        iikoId: category.id,
        slug: createSlug(name),
      };
    })
  },
  filter(categories, { products }){

    return categories.reduce((acc, category) => {
      const isHasNoProducts = !products.find(( product ) => product.parentGroup === category.id);

      if (isHasNoProducts) {
        acc.nonFiltered.push({
          data: category,
          errors: [{
            keyword: 'noProducts',
            message: 'is has no products'
          }]
        })
        return acc;
      }

      const isDuplicate = acc.filtered.find((c) => (
        createSlug(c.name.trim()) === createSlug(category.name.trim())
      ));

      if (isDuplicate) {
        acc.nonFiltered.push({
          data: category,
          errors: [{
            keyword: 'duplicate',
            message: 'this is a duplicate'
          }]
        });
        return acc;
      }

      acc.filtered.push(category);
      return acc;
      },{
      filtered: [],
      nonFiltered: [],
    });
  },
};