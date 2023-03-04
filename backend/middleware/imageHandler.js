// const multer = require('multer');

// // Set storage engine for uploaded images
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         const originalName = file.originalname.replace(/-(?=[^:,\}]*($|:|,|\}))/g, '_');
//         cb(null, Date.now() + '_' + originalName);
//     }
// });

// // Create multer instance for file upload
// const upload = multer({
//     storage: storage
// }).single('image');

// module.exports = {
//     upload
// };
