
import util from "util";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dbConfig from "../config/index.js";




const storage = new GridFsStorage({
    url: dbConfig.db.uri,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}${file.originalname}`;
            return { filename };
        }

        return {
            bucketName: dbConfig.imgBucket,
            filename: `${Date.now()}${file.originalname}`,
            metadata: {
                MaHinh: req.body.MaHinh,
                TenHinh: file.originalname,
                MSHH: req.body.MSHH,
            },
        };
    }
});

const upload = multer({ storage });
// const uploadFilesMiddleware = util.promisify(upload.single("file"));

var uploadFiles = multer({ storage: storage }).array("file", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
export default { uploadFilesMiddleware };

