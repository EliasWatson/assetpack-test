import { msdfFont } from "@assetpack/core/webfont";

export default {
  entry: "./raw-assets",
  output: "./public/assets",
  cache: false,
  pipes: [msdfFont()],
};
