require('dotenv').config();
const slugify = require('slugify')
const fetch = require('node-fetch');
const auth = require('./auth');

module.exports = {
  async getNomenclature() {
    const config = await this.getConfig();
    const nomenclature = await this.fetchNomenclature(config);
    return this.normalizeNomenclature(nomenclature);
  },
  async fetchNomenclature({ host, nomenclatureUrl, organizationId, token }) {
    const url = `${host}/${nomenclatureUrl}/${organizationId}?access_token=${token}`;
    return fetch(url)
      .then(res => res.json())
  },
  normalizeNomenclature({ groups, products, revision, uploadDate }) {
    return {
      revision,
      uploadDate,
      categories: groups.filter((g) => g.isIncludedInMenu),
      groupModifiers: groups.filter((g) => !g.isIncludedInMenu),
      products: products.filter((p) => p.type !== 'modifier'),
      modifiers: products.filter((p) => p.type === 'modifier'),
    }
  },
  normalizeCategories(categories) {
    return categories.reduce((acc, category) => {
      const slug = slugify(category.name.trim(), {
        lower: true,
        strict: true,
      });

      const exists = acc.find(c => c.slug === slug);

      if (exists) {
        return acc;
      }

      acc.push({
        ...category,
        slug,
        iikoId: category.id,
        name: category.name.trim(),
        img: (category.images && category.images.length)
          ? category.images[0].imageUrl : 'https://frontend.italy.ismart.pro/storage/food/food-05.png',
      });
      return acc;
    }, [])
  },
  normalizeProducts(products) {
    return products.reduce((acc, product) => {
      if (product.type !== 'modifier') {

        const slug = slugify(product.name.trim(), {
          lower: true,
          strict: true,
        });

        const exists = acc.find(p => p.slug === slug);

        if (exists) {
          return acc;
        }

        acc.push({
          ...product,
          slug,
          iikoId: product.id,
          name: product.name.trim(),
          category: product.productCategory,
          img: (product.images && product.images.length)
            ? product.images[0].imageUrl : 'https://frontend.italy.ismart.pro/storage/food/food-07.png',
        });
      }
      return acc;
    }, []);
  },
  normalizeModifiers(products) {
    return products.reduce((acc, product) => {
      if (product.type === 'modifier') {
        const slug = slugify(product.name.trim(), {
          lower: true,
          strict: true,
        });
        acc.push({
          ...product,
          slug,
          iikoId: product.id,
          name: product.name.trim(),
          img: (product.images && product.images.length)
            ? product.images[0].imageUrl : 'https://frontend.italy.ismart.pro/storage/food/food-06.png',
        })
      }
      return acc;
    }, []);
  },
  createSlug(str) {
    return slugify(product.name.trim(), {
      lower: true,
      strict: true,
    });
  },
  async getConfig() {
    const token = await auth.getToken();
    return {
      token,
      host: process.env.IIKO_HOST,
      organizationId: process.env.IIKO_ORGANIZATION_ID,
      nomenclatureUrl: 'api/0/nomenclature',
    }
  }
};