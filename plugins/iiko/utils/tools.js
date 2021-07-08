const Ajv = require("ajv").default;
const slugify = require('slugify')

module.exports = {
  validate(collection, schema) {
    const ajv = new Ajv({
      strict: false,
    });
    const verify = ajv.compile(schema);
    return collection.reduce((acc, item) => {
      const isValid = verify(item);
      if (isValid) {
        acc.valid.push(item);
      } else {
        acc.nonValid.push({
          data: item,
          errors: verify.errors,
        })
      }

      return acc;
    }, {
      valid: [],
      nonValid: []
    });
  },
  createSlug(str) {
    return slugify(str.trim(), {
      lower: true,
      strict: true,
    });
  },
}