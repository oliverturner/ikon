export function getText(entry) {
  return new Promise(function (resolve, reject) {
    entry.file(function (file) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }, reject);
  });
}

export function getImg(entry) {
  return new Promise(function (resolve, reject) {
    entry.file(function (file) {
      console.log({ file }, file.type.startsWith("image"));

      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => URL.revokeObjectURL(url);
      img.onerror = reject;
      img.src = url;
      resolve(img);
    }, reject);
  });
}