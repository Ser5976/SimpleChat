import * as uuid from 'uuid'; //используется для создания уникального имени
import * as path from 'path';
import * as fs from 'fs';

//создаём имя файла,записываем его в папку static
class FileServise {
  saveFile(file) {
    // console.log(file);
    try {
      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve('static', fileName);
      file.mv(filePath);
      // console.log(fileName);
      return fileName;

      // console.log(fileName);
    } catch (e) {
      console.log(e);
    }
  }
  // удаление файлов изи папки static
  deleteFile(fileName) {
    // console.log(fileName);
    try {
      const filePath = path.join('static', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default new FileServise();
