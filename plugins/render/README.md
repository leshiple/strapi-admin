# Strapi plugin render

##Конфигурационный файл `/config/render.js`:
```javascript
const path = require('path');

module.exports = {
  templateDir: path.resolve('src/templates'), // Директория в которой будут искать шаблоны
  publicDir: path.resolve('public'),
  presets: {
    product: {
      template: 'product.njk',
      output(product) {
        return `${product.categoryId.slug}/${product.slug}`;
      },
    }
  }
}
```
где:
- `templateDir` - директория в которой будет искаться файл шаблона
- `publicDir` - директория в которую, исходя из output, будут сохраняться итоговые файлы
- `presets` набор настроек
- `product` - название пресета
- `template` - шаблон
- `output` - путь внутри publicDir по которому будет сохранен итоговый html файл. Может быть как строкой, так и функцией которая должна возвращать строку

## Пример рендеринга
```javascript
strapi.plugins.render.services.render.renderToFile('product', data);
```
Функция renderToFile принимает вход два аргумента:
1. `presetName` - название пресета из конфигурационного файла.
2. `data` - данные которые будут переданы в движок рендера при ренедеринги шаблона

## Пример удаления отрендеренного файла
```javascript
strapi.plugins.render.services.render.renderToFile('product', data);
```
Функция renderToFile принимает вход два аргумента так же как и функция `renderToFile`