import upload from "../services/upload.service.js";
import dbConfig from "../config/index.js";

// import MongoDB from "mongodb";
import { GridFSBucket } from "mongodb";
import { MongoClient } from "mongodb";

const url = dbConfig.db.uri;
const baseUrl = "http://localhost:3000/files/";
const mongoClient = new MongoClient(url);

const uploadFiles = async (req, res) => {
    try {
        await upload.uploadFilesMiddleware(req, res);
        console.log(req.files.length);
        console.log(req.files);
        if (req.files.length <= 0) {
            return res
                .status(400)
                .send({ message: "You must select at least 1 file." });
        }
        return res.status(200).send({
            message: "Files have been uploaded.",
        });

    } catch (error) {
        console.log(error);

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).send({
            message: "Too many files to upload.",
          });
        }
        return res.status(500).send({
          message: `Error when trying upload many files: ${error}`,
        });
    
    }
};

const getListFiles = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const images = database.collection(dbConfig.imgBucket + ".files");

        const cursor = images.find({});

        if ((await cursor.count()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
            });
        });

        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};


// const downloadbyMSHH = async (req, res) => {
//     try {
//         await mongoClient.connect();

//         const database = mongoClient.db(dbConfig.database);
//         const bucket = new GridFSBucket(database, {
//             bucketName: dbConfig.imgBucket,
//         });

//         const MSHH = req.query.MSHH; // Get the attribute from the query parameter

//         // Find the image based on the attribute in the meta
//         const query = { "MSHH": MSHH };
//         const file = await bucket.find(query).toArray();

//         if (file.length === 0) {
//             return res.status(404).send({ message: "Image not found!" });
//         }

//         const downloadStream = bucket.openDownloadStream(file[0]._id);

//         downloadStream.on("data", function (data) {
//             return res.status(200).write(data);
//         });

//         downloadStream.on("error", function (err) {
//             return res.status(500).send({ message: "Error downloading the image!" });
//         });

//         downloadStream.on("end", () => {
//             return res.end();
//         });
//     } catch (error) {
//         return res.status(500).send({
//             message: error.message,
//         });
//     }
// };

const downloadbyMSHH = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(dbConfig.database);
        const bucket = new GridFSBucket(database, {
            bucketName: dbConfig.imgBucket,
        });

        const MSHH = req.params.MSHH; // Get the attribute from the query parameter
        console.log(MSHH);
        // Fix: Find the image based on the MSHH attribute in the metadata
        const query = { "metadata.MSHH": MSHH };
        const file = await bucket.find(query).toArray();

        if (file.length === 0) {
            return res.status(404).send({ message: "Image not found!" });
        }

        const downloadStream = bucket.openDownloadStream(file[0]._id);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(500).send({ message: "Error downloading the image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};


export default {
    uploadFiles,
    getListFiles,
    download,
    downloadbyMSHH
};
