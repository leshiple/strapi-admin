const update = require('../services/update');
module.exports = {
  async update(ctx) {
    return update.update(ctx.request.body);
  },
};