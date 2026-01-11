import multer from "multer";
import path from "path";
import fs from "fs";
const maxSize = 2 * 1024 * 1024;

function makeStorage(subfolder) {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join("uploads", "images", subfolder);

            fs.mkdirSync(uploadPath, {recursive: true});
            cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    });
}

const fileFilter = (req, file, cb) => {

    if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
};


export const uploadIcon = multer({storage: makeStorage("icons"), fileFilter, limits: { fileSize: maxSize }});
export const uploadBanner = multer({storage: makeStorage("banners"), fileFilter, limits: { fileSize: maxSize }});
export const uploadPostImages = multer({storage: makeStorage("posts"), fileFilter, limits: { fileSize: maxSize }});
