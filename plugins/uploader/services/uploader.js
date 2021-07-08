const path = require('path');
const fsExtra = require('fs-extra');
const fetch = require('node-fetch');
const fileType = require('file-type');

const tmpDir = path.resolve('.tmp-uploader');

module.exports = {
  async index(file) {
    this.createTempDir();

    const downloadedFile = await this.download(file, tmpDir);
    const uploadedFile = await this.upload(downloadedFile);

    this.removeTempDir();
    return uploadedFile[0];
  },
  async download({name, url }, tmpDir) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const { ext, mime } = await fileType.fromBuffer(buffer);
    const filePath = path.join(tmpDir, `${name}.${ext}`);

    await fsExtra.writeFileSync(filePath, buffer);

    const { size } = fsExtra.statSync(filePath);

    return {
      name,
      filePath,
      ext,
      mime,
      size,
    }
  },
  async upload({ name, ext, mime, size, filePath }) {
    return strapi.plugins.upload.services.upload.upload({
      data: { fileInfo: { alternativeText: '', caption: '', name: null } },
      files: {
        size,
        path: filePath,
        name: `${name}.${ext}`,
        type: mime,
      }
    });
  },
  createTempDir() {
    fsExtra.ensureDirSync(tmpDir);
  },
  removeTempDir() {
    fsExtra.removeSync(tmpDir);
  }
};