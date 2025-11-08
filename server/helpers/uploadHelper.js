import multer from "multer";
import path from "path";
import fs from "fs";


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
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only jpeg, png, jpg"), false);
    }
};


export const uploadIcon = multer({storage: makeStorage("icons"), fileFilter});
export const uploadBanner = multer({storage: makeStorage("banners"), fileFilter});
export const uploadPostImages = multer({storage: makeStorage("posts"), fileFilter});
