const ImageKit = require("@imagekit/nodejs");
const fs = require("fs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  // This is the default and can be omitted
});

const uploadFile = async (filePath, fileName) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const result = await imagekit.files.upload({
      file: fileStream,
      fileName: fileName,
      useUniqueFileName: true,
    });

    return result;
  } catch (error) {
    console.log(`ImageKit Error: ${error}`);
  }
};

module.exports = {
  uploadFile,
};
