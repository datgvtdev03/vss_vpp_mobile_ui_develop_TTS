import RNFS from "react-native-fs";
import ImageResizer from "react-native-image-resizer";
// import RNFetchBlob from "rn-fetch-blob";

export const convertBase64ToPdf = async (base64Data: string) => {
  let fPath = RNFS.CachesDirectoryPath;
  fPath = `${fPath}/temp_pdf_${new Date().getTime()}.pdf`;

  await RNFS.writeFile(fPath, base64Data, "base64");
  return fPath;
};

export const convertBase64ToPng = async (base64Data: string) => {
  const pdf_base64 = `data:application/png;base64,${base64Data}`;
  let fPath = RNFS.CachesDirectoryPath;
  fPath = `${fPath}/temp_png_${new Date().getTime()}.png`;

  await RNFS.writeFile(fPath, pdf_base64, "base64");
  return fPath;
};

export const convertImgUrlToBase64 = async (ImageUrl: string) => {
  const base = await RNFS.readFile(ImageUrl, "base64");
  return base;
};

export const compressCus = async (ImageUrl: string) => {
  const resizeImage = await ImageResizer.createResizedImage(
    ImageUrl,
    840,
    840,
    "JPEG",
    60,
    undefined,
    undefined,
    false,
    { mode: "cover", onlyScaleDown: true }
  );
  const base = await RNFS.readFile(resizeImage.path, "base64");

  return { resizeImage, base64: base };
};

export const compressImage = async (ImageUrl: string) => {
  const resizeImage = await ImageResizer.createResizedImage(
    ImageUrl,
    // 250,
    // 250,
    // "JPEG",
    // 50,
    840,
    840,
    "JPEG",
    60,
    undefined,
    undefined,
    false,
    { mode: "cover", onlyScaleDown: true }
  );
  const base = await RNFS.readFile(resizeImage.path, "base64");
  const encodeUrlBase64 = encodeURIComponent(base);
  //   console.log("encodeUrlBase64", encodeUrlBase64);

  return { resizeImage, base64: encodeUrlBase64 };
};

export const compressSignImage = async (ImageUrl: string) => {
  const resizeImage = await ImageResizer.createResizedImage(
    ImageUrl,
    250,
    250,
    "JPEG",
    50,
    undefined,
    undefined,
    false,
    { mode: "cover", onlyScaleDown: true }
  );
  const base = await RNFS.readFile(resizeImage.path, "base64");
  //   console.log("encodeUrlBase64", encodeUrlBase64);

  return { resizeImage, base64: base };
};

export const writeJSON = async (json: string) => {
  let fPath = RNFS.DocumentDirectoryPath;
  fPath = `${fPath}/request.txt`;

  await RNFS.writeFile(fPath, json, "utf8");
  return fPath;
};
