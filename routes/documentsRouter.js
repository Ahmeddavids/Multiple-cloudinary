const { documentUploads, multipleUploads } = require('../controllers/documents');
const upload = require('../middlewares/multer');

const router = require('express').Router();

router.post('/uploads', upload.array('documents', 5), documentUploads)

router.post('/uploads-multiple', upload.fields([{ name: 'documents', maxCount: 5 }, { name: 'displayPicture', maxCount: 1 }]), multipleUploads)

module.exports = router;
