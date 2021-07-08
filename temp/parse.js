/* eslint-disable */
const fs = require("fs");
const path = require("path");

const nomencalturePath = path.join(__dirname, "nomenclature.json");
const productsPath = path.join(__dirname, "products.json");
const categoriesPath = path.join(__dirname, "categories.json");
const modifiersPath = path.join(__dirname, "modifiers.json");
const nomenclature = JSON.parse(fs.readFileSync(nomencalturePath, "utf8"));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugify(str) {
  return str.replace(/[&\/\\#,+()$~%.'":*?<>{}\s]/g, '_');
}

const allModifiers = [];

const products = nomenclature.products.reduce((accProduct, product) => {
  if (product.type === "dish") {

    const has = accProduct.find(p => p.name.trim() === product.name.trim());

    if (has) {
      console.log(product.name);
      return accProduct;
    }

    accProduct.push({
      id: product.id,
      active: true,
      code: product.code,
      slug: slugify(product.name.trim()),
      name: product.name.trim(),
      composition:
        "тыква, авокадо, киноа, мед, масло оливковое, шпинат, кедровый орех, мята, соль",
      description: product.description,
      energyAmount: product.energyAmount,
      energyFullAmount: product.energyFullAmount,
      fiberAmount: product.fiberAmount,
      fiberFullAmount: product.fiberFullAmount,
      fatFullAmount: product.fatFullAmount,
      fatAmount: product.fatAmount,
      carbohydrateAmount: product.carbohydrateAmount,
      carbohydrateFullAmount: product.carbohydrateFullAmount,
      weight: product.weight,
      measureUnit: product.measureUnit,
      price: product.price,
      category: product.productCategoryId,
      groupModifiers: getGroupModifiers(product.groupModifiers),
      image: 'https://frontend.italy.ismart.pro/storage/food/food-07.png',
    });
  }
  return accProduct;
}, []);

function getGroupModifiers(groups) {
  return groups.reduce((accGroup, gr) => {
    if (gr.modifierId === "2bc33ff0-07d1-4976-b5b8-5447548ca8f7") {
      return accGroup;
    }

    const { name } = nomenclature.groups.find(
      (item) => item.id === gr.modifierId
    );

    const modifiers = gr.childModifiers.reduce((accModifier, mod) => {
      const currentModifier = nomenclature.products.find(
        (item) => item.id === mod.modifierId
      );

      if (!currentModifier) {
        return accModifier;
      }

      const modifier = {
        id: mod.modifierId,
        name: currentModifier.name.trim(),
        slug: slugify(currentModifier.name.trim()),
        minAmount: mod.minAmount,
        maxAmount: mod.maxAmount,
        required: mod.required,
        energyAmount: currentModifier.energyAmount || 0,
        energyFullAmount: currentModifier.energyFullAmount || 0,
        fiberAmount: currentModifier.fiberAmount || 0,
        fiberFullAmount: currentModifier.fiberFullAmount || 0,
        fatFullAmount: currentModifier.fatFullAmount || 0,
        fatAmount: currentModifier.fatAmount || 0,
        carbohydrateAmount: currentModifier.carbohydrateAmount || 0,
        carbohydrateFullAmount: currentModifier.carbohydrateFullAmount || 0,
        price: currentModifier.price || 0,
        weight: currentModifier.weight || 0,
        measureUnit: currentModifier.measureUnit,
      };

      accModifier.push(modifier.id);

      const exist = allModifiers.find((m) => m.id === modifier.id);

      if (!exist) {
        allModifiers.push(modifier);
      }

      return accModifier;
    }, []);

    const group = {
      id: gr.modifierId,
      name: name.trim(),
      slug: slugify(name.trim()),
      minAmount: gr.minAmount,
      maxAmount: gr.maxAmount,
      required: gr.required,
      childModifiers: modifiers,
    };

    accGroup.push(group);

    return accGroup;
  }, []);
}

const categories = nomenclature.productCategories.reduce((acc, item) => {
  const hasProduct = !products.every((product) => product.category !== item.id);
  if (hasProduct) {
    acc.push({
      id: item.id,
      slug: slugify(item.name.trim()),
      name: item.name,
      productPlaceholder: "https://via.placeholder.com/600x400",
    });
  }
  return acc;
}, []);
fs.writeFileSync(categoriesPath, JSON.stringify(categories));

const normalizedProducts = products.map((product) => {
  product.category = categories.find((item) => item.id === product.category);
  return product;
});
fs.writeFileSync(productsPath, JSON.stringify(normalizedProducts));
fs.writeFileSync(modifiersPath, JSON.stringify(allModifiers));
