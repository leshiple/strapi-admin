const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const _ = require('lodash');

module.exports = {
  async generate(params) {
    params.forEach(({ preset, img }) => {
      if (Array.isArray(img)) {
        img.forEach((i) => this.generatePreset(preset, i));
      } else {
        this.generatePreset(preset, img)
      }
    })
  },

  async generatePreset(presetName, img) {
    const preset = await this.getPreset(presetName);
    const formats = this.generateFormats(preset, img.hash);

    const isNotExistFormats = !this.isExistFormats(img.formats, formats);

    if (isNotExistFormats || true) {
      this.updateFormats(img, formats);
      this.generateImages(img, formats);
    }

  },

  isExistFormats(srcFormats, targetFormats) {
    const defaultFormatsNames = Object.keys(strapi.config.get('plugins.upload.breakpoints', []));
    const obj = _.omit(srcFormats, [
      'thumbnail',
      ...defaultFormatsNames,
    ]);
    return _.isEqual(obj, targetFormats);
  },

  generateFormats(preset, hash) {
    return Object.keys(preset.sizes).reduce((acc, sizeName) => {
      const size = preset.sizes[sizeName];
      preset.extension.forEach((ext) => {
        const presetHash = `${hash}-${sizeName}`;
        const name = `${presetHash}.${ext}`;
        const presetName = `${sizeName}-${ext}`;
        acc[presetName] = {
          name: name,
          hash: presetHash,
          ext: `.${ext}`,
          mime: `image/${ext}`,
          width: size.width,
          height: size.height,
          url: `/uploads/${name}`,
        }
      })
      return acc;
    }, {})
  },

  async getPreset(preset) {
    return strapi.config.get(`image-generator.presets.${preset}`, '');
  },

  getUploadDir() {
    const configPublicPath = strapi.config.get(
      'middleware.settings.public.path',
      strapi.config.paths.static
    );

    return path.resolve(configPublicPath, 'uploads');
  },

  async updateFormats(image, formats) {
    const resultFormats = _.merge(image.formats, formats);
    const fileValues = {
      formats: resultFormats,
    }
    strapi.query('file', 'upload').update({id: image.id}, fileValues);
  },

  generateImages(image, formats) {
    const uploadDir = this.getUploadDir();
    const file = path.resolve(uploadDir,`${image.hash}${image.ext}`);

    fs.readFile(file, (err, data) => {
      if (err) {
        console.log(err);
        return false;
      }

      Object.keys(formats).forEach((formantName) => {
        const format = formats[formantName];
        const outputFile = path.resolve(uploadDir, format.name);
        sharp(data)
          .resize(format.width, format.height)
          .toFile(outputFile, (err) => {
            if (err) {
              console.log(err);
            }
          });
      })

    })
  },

  resizeTo(buffer, options) {
    sharp(buffer)
      .resize(options)
      .toBuffer()
      .catch(() => null);
  },

  async uploadFile(fileData) {
    await strapi.plugins.upload.provider.upload(fileData);
  },
};