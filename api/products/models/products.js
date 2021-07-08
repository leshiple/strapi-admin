const postProcessing = (product) => {
  // if (product.category) {
  //   strapi.plugins.render.services.render.renderToFile('product', product);
  // }
  if (product.img) {
    strapi.plugins['image-generator'].services['image-generator'].generate([
      {
        preset: 'product',
        img: product.img,
      },
    ]);
  }
}
module.exports = {
  lifecycles: {
    async afterCreate(result) {
      postProcessing(result);
    },
    // async afterUpdate(result) {
    //   postProcessing(result);
    // },
    // async afterDelete(result) {
    //   let products = Array.isArray(result) ? result : [result];
    //
    //   products.forEach((product) => {
    //     if (product.category) {
    //       strapi.plugins.render.services.render.delete('product', product);
    //     }
    //   })
    // },
  }
};
