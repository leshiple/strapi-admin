const path = require('path');

module.exports = {
  templateDir: path.resolve('src/templates'),
  publicDir: path.resolve('public'),
  presets: {
    product: {
      template: 'product.njk',
      output(product) {
        return `${product.category.slug}/${product.slug}/index`;
      },
    }
  }
}
