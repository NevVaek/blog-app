import fs from "fs";
import path from "path";


export default async function deleteWare(mode, paths) {
    try {
        if (mode === "banner") {
            if (!paths.filename && path.dirname(paths).includes("defaults")) return true;  // Checks if the parent directory contains the word "defaults"

            const localPath = path.join(
                    "uploads/images/banners/", paths.filename ? paths.filename : path.basename(paths)     // Convert the filepaths to local dir path
                );

            await fs.unlink(localPath, (err) => {
                if (err) {
                    console.error(`Failed to delete file for mode: ${mode}, file: ${localPath}`);
                } else {
                    console.log(`File deleted for mode: ${mode}`);
                }
            });
            return true;
        } else if (mode === "post") {
            if (!Array.isArray(paths)) {                                // Checks if the "paths" is an array before proceeding
                throw new Error(`The provided second argument "paths" is not an array`);
            }

            await Promise.allSettled(
                paths.map(filePath => {
                    const localPath = path.join(                // Convert the filepaths to local dir path
                    "uploads/images/posts/", filePath.filename ? filePath.filename : path.basename(filePath));
                    fs.unlink(localPath, (err) => {
                        if (err) {
                            console.error(`Failed to delete file for mode: ${mode}, file: ${localPath}`);
                        }
                    });
                })
            );
            return true;
        }
        throw new Error("Unknown mode");
    } catch (err) {
        console.error("Delete failed", err.message);
        return false;
    }
}

