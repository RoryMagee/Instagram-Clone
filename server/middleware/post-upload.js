const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: process.env.aws_access_id_key, secretAccessKey: process.env.aws_secret_access_key });

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'instagramstorage',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now().toString());
        }
    })
});