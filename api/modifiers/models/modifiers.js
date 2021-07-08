const postProcessing = (modifier) => {
  if (modifier.img) {
    strapi.plugins['image-generator'].services['image-generator'].generate([
      {
        preset: 'modifier',
        img: modifier.img,
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
