const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');

module.exports = {
  renderToFile(preset, data) {
    const { outputPath } = this.getOutput(preset, data);
    const html = this.render(preset, data);

    this.saveToFile(outputPath, html);
  },
  render(preset, data) {
    const templateDir = strapi.config.get('render.templateDir', '');
    const { template } = strapi.config.get(`render.presets.${preset}`);
    const templatePath = path.join(templateDir, template);

    return nunjucks.render(templatePath, data);
  },
  delete(preset, data) {
    const { outputPath, dirname } = this.getOutput(preset, data);

    this.deleteFile(outputPath);
    this.deleteDir(dirname);
  },
  saveToFile(path, data) {
    fsExtra.outputFileSync(path, data);
  },
  deleteFile(file) {
    fsExtra.removeSync(file);
  },
  deleteDir(dirname) {
    try{
      fs.rmdirSync(dirname);
    }
    catch(err){
      return false;
    }
  },
  getOutput(preset, data) {
    const publicDir = strapi.config.get('render.publicDir', '');
    const { output } = strapi.config.get(`render.presets.${preset}`);

    const outputFile = typeof output === 'string' ? `${output}.html` : `${output(data)}.html`;
    const outputPath = path.resolve(publicDir, outputFile);

    const filename = path.basename(outputPath);
    const dirname = path.dirname(outputPath);

    return {
      filename,
      dirname,
      outputPath,
    }
  }
};