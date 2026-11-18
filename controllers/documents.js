const { Documents_Portal } = require('../models');
const cloudinary = require('../config/cloudinary');

exports.documentUploads = async (req, res) => {
    try {
        const { username } = req.body;
        const files = req.files

        const record = await Documents_Portal.findOne({ where: { username } });
        if (record) {
            return res.status(400).json({
                message: `User record with username:${username} already exists, Please update your documents instead.`
            })
        }

        if (files.length == 0) {
            return res.status(400).json({
                message: 'Please upload at least one file'
            })
        }

        const uploadedFiles = files.map((file) => file.path);
        console.log('Files: ', files)
        console.log('UploadedFiles: ', uploadedFiles)

        const documents = [];

        // uploadedFiles.forEach(async (element) => {
        //    const result =  await cloudinary.uploader.upload(element)
        //    const obj = {}
        //    obj.fileUrl = result.secure_url
        //    obj.fileId = result.public_id
        //    documents.push(obj)
        //    console.log('OBJ: ', obj)
        // });

        for (const file of uploadedFiles) {
            console.log(file)
            const result = await cloudinary.uploader.upload(file)
            const obj = {}
            obj.fileUrl = result.secure_url
            obj.fileId = result.public_id
            documents.push(obj)
            console.log('OBJ: ', obj)
        }

        console.log('Documents: ', documents)

        const data = {
            username,
            documents
        }

        const newUpload = await Documents_Portal.create(data);

        res.status(200).json({
            message: 'Upload successfully',
            data: newUpload
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}


exports.multipleUploads = async (req, res) => {
    try {
        const { username } = req.body;
        const files = req.files
        const record = await Documents_Portal.findOne({ where: { username } });
        if (record) {
            return res.status(400).json({
                message: `User record with username:${username} already exists, Please update your documents instead.`
            })
        }

        console.log('Files: ', files)

        if (!files.documents || !files.displayPicture) {
            return res.status(400).json({
                message: 'Please upload documents and display picture'
            })
        }

        const displayPath = files.displayPicture[0].path
        const documentsPaths = files.documents.map((element) => element.path)

        const data = {
            documents: [],
            username
        }

        if (files.displayPicture) {
            const result = await cloudinary.uploader.upload(displayPath);
            data.displayPicture = result.secure_url
        }

        if (files.documents) {
            for (const file of documentsPaths){
               const result =  await cloudinary.uploader.upload(file);
            //    const obj = {}
            //    obj.fileUrl = result.secure_url
            //    obj.fileId = result.public_id
            const obj = {
                fileUrl: result.secure_url,
                fileId: result.public_id
            }
               data.documents.push(obj)
               console.log(data.docs)
            }
        }

        const newUploads = await Documents_Portal.create(data);

        res.status(201).json({
            message: "Multiple uploads successful",
            data: newUploads
        })

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

