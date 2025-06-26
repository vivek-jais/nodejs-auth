const Image = require('../models/Image')
const {uploadToCloudinary} = require('../helper/cloudinary-helper')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req,res)=>{
    try{
        //check if file is missing in req object
        if(!req.file){
            return res.status(400).json({
                success:false,
                message: 'file is required.please uploed an Image'
            })
        }

        //upload to cloudinary
        const {url,publicId} = await uploadToCloudinary(req.file)

        //store image url and public id along with uploaded user id

        const newlyUploadedImage =  new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userId,
        })

        await newlyUploadedImage.save();

        //delete the file from local storage
        fs.unlinkSync(req.file.path)

        res.status(200).json({
            success:true,
            message:'Image uploaded successfully!..',
            image: newlyUploadedImage
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message:'Somthing went wrong in image upload'
        })
        
    }
};

// fetching all images data

const fetchImagesController = async (req, res) => {
  try {
    //Pagination and sorting images
    const page =  parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit)||2;
    const skip = (page-1)*limit; 
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder ==='asc'?1:-1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages/limit);

    const sortObj={}
    sortObj[sortBy] =sortOrder

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

    if(images){
      return  res.status(200).json({
            success:true,
            currentPage:page,
            totalPages:totalPages,
            totalImages:totalImages,
      
            data:images
        })
    }

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Somthing went wrong in getting images data ",
    });
  }
};


const deleteImageController = async(req,res)=>{
  try {
    //get curr id of image to be deleted
    const currId = req.params.id;
    const userId = req.userInfo.userId;
    const image = await Image.findById(currId);

    if(!image){
            return  res.status(404).json({
            success:true,
            message:'Image not found'
        })
    }

    //check if this image is uploaded by current user
    if(image.uploadedBy.toString()!== userId){
      return res.status(403).json({
        success:false,
        message: 'You are not authorize to delete this image'
      })
    }

    //delete this image first from cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);

    //delete this image from mongodb database
    await Image.findByIdAndDelete(currId);

    res.status(200).json({
      success:true,
      message:'Image delated successfully!'
    })

  } 
  catch (e) {
        console.log(e);
    res.status(500).json({
      success: false,
      message: "Somthing went wrong in getting images data ",
    });
}
}




module.exports = { uploadImageController, fetchImagesController, deleteImageController };
