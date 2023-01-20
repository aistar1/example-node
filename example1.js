const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const address = "127.0.0.1:1234";

// async file reader
async function readFiles(dirname) {
  const data = [];
  const files = await fs.promises.readdir(dirname);
  let i = 0;
  for (const filename of files) {
    const full = path.join(dirname, filename);
    const imageBuffer = await fs.promises.readFile(full, {encoding: 'base64'});
    const imageBase64 = `${imageBuffer}`;
    data[i] = imageBase64;
    i = i + 1;
  }
  return data;
}

async function spcimg(imgPath) {
  const data = await readFiles(imgPath);
  for (const [index, img] of data.entries()) {
    const spcId = String(index + 1);
    await axios.post(`http://${address}/image-process`, {
      "payload": {
        "data": [
          {"objectId": spcId, "image": img}
        ]
      }
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.result === false) errorFalse.push(spcId);
      })
      .catch((error) => {
        console.log(error);
        errorArray.push(spcId);
      })
  }
  console.log('errorArray ',errorArray);
  console.log('errorFalse ',errorFalse);
}

async function main() {
  const imgPath = './im'
  await spcimg(imgPath);
}

main();
