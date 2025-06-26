const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");

//controller
const {uploadImageController,fetchImagesController, deleteImageController} = require("../controllers/image-controller");

const router = express.Router();

//upload image
//next midleware can access data of prev
//multer middleware-->

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImageController
);

// get all images
router.get("/get", authMiddleware, fetchImagesController);

//delete image route

router.delete("/delete/:id",authMiddleware,adminMiddleware,deleteImageController)



module.exports = router;
