const postProcessing = (product) => {
  if (product.img) {
    strapi.plugins['image-generator'].services['image-generator'].generate([
      {
        preset: 'category',
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
    async afterUpdate(result) {
      postProcessing(result);
    },
  }
};
