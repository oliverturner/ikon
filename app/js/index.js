// import Whatever from 'https://unpkg.com/whatever'
// import Whatever from 'whatever'

// import { default as index_css }  from './css/index.css'
// console.info(index_css)

console.log("💀🤘");

const dropzone = document.querySelector("[data-component=dropzone]");
const rootContainer = document.querySelector("[data-component=container]");

function getContents(entry) {
  return new Promise(function(resolve, reject) {
    entry.file(function(file) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    }, reject);
  });
}

function getImgReader(entry) {
  return new Promise(function(resolve, reject) {
    entry.file(function(file) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    }, reject);
  });
}

function getImg(entry) {
  return new Promise(function(resolve, reject) {
    entry.file(function(file) {
      /*
      console.log("/image/.test(file.type)", /image/.test(file.type));
      console.log(file.type.startsWith('image/'))

      if (/image/.test(file.type)) {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => URL.revokeObjectURL(url);
        img.src = url;
        resolve(img);
      } else {
        reject(file.type);
      }
      */
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

async function scanFiles(item, container) {
  const el = document.createElement("li");
  container.appendChild(el);

  if (item.isDirectory) {
    const directoryReader = item.createReader();
    const directoryContainer = document.createElement("ul");

    el.innerHTML = item.name;

    container.appendChild(directoryContainer);

    directoryReader.readEntries(entries => {
      entries.forEach(entry => {
        scanFiles(entry, directoryContainer);
      });
    });
  } else if (item.isFile) {
    try {
      const [contents, img] = await Promise.all([
        getContents(item),
        getImg(item)
      ]);
      el.appendChild(img);
      // console.log(contents);
    } catch (err) {
      console.error(err);
    }
  }
}

dropzone.addEventListener(
  "dragover",
  event => {
    event.preventDefault();
  },
  false
);

dropzone.addEventListener(
  "drop",
  event => {
    event.preventDefault();

    rootContainer.innerHTML = "";

    for (let item of event.dataTransfer.items) {
      scanFiles(item.webkitGetAsEntry(), rootContainer);
    }
  },
  false
);
