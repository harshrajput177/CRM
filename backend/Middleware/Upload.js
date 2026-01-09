const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Config/Cloud");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crm-files",
    resource_type: "raw",   
  },
});

const upload = multer({ storage });

module.exports = upload;
