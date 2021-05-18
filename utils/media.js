export const getLogoURL = (url) => {
  return url
    ? url.replace(/https:\/\/drive.google.com\/file\/d\/([^/]+)\/view.*/, "https://drive.google.com/uc?export=view&id=$1")
    : "https://www.logolynx.com/images/logolynx/9a/9ac18e68c03ad7a5692da1b8c14dff58.jpeg";
};