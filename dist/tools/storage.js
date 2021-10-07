"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filesTypeCheck = exports.filesSizeCheck = exports.emptyS3Directory = exports.getS3Object = exports.UploadFile = void 0;
const aws_sdk_1 = require("aws-sdk");
const s3 = new aws_sdk_1.S3({
    endpoint: process.env.SPACES_URL,
    accessKeyId: process.env.SPACES_ACCESS_KEY,
    secretAccessKey: process.env.SPACES_SECRET_KEY,
});
const UploadFile = async (buffer, url) => {
    await s3
        .upload({
        Bucket: 'moroccanoutlaws',
        ACL: 'private',
        Key: url,
        Body: buffer,
    })
        .send((err) => {
        if (err) {
            console.error(err);
        }
    });
};
exports.UploadFile = UploadFile;
const getS3Object = (key) => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: 'moroccanoutlaws',
            Key: key,
        }, (err, data) => {
            if (err) {
                console.log(key, err);
                reject(err);
            }
            if (data && data.Body) {
                const buffer = Buffer.from(data.Body);
                resolve(buffer.toString('base64'));
            }
            else {
                reject('NONE');
            }
        });
    });
};
exports.getS3Object = getS3Object;
const emptyS3Directory = async (dir) => {
    var _a, _b;
    const listParams = {
        Bucket: 'moroccanoutlaws',
        Prefix: dir,
    };
    try {
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        if (((_a = listedObjects.Contents) === null || _a === void 0 ? void 0 : _a.length) === 0)
            return;
        const deleteParams = {
            Bucket: 'moroccanoutlaws',
            Delete: { Objects: [] },
        };
        (_b = listedObjects.Contents) === null || _b === void 0 ? void 0 : _b.forEach(({ Key }) => {
            var _a, _b;
            (_b = (_a = deleteParams.Delete) === null || _a === void 0 ? void 0 : _a.Objects) === null || _b === void 0 ? void 0 : _b.push({ Key });
        });
        await s3.deleteObjects(deleteParams).promise();
        if (listedObjects.IsTruncated)
            await (0, exports.emptyS3Directory)(dir);
    }
    catch (error) {
        console.error(error);
        return;
    }
};
exports.emptyS3Directory = emptyS3Directory;
const filesSizeCheck = (files, size = 20) => {
    if (!files || !files.length)
        return false;
    return files.every((file) => {
        const mb = file.size / 1024 / 1024;
        return mb <= size;
    });
};
exports.filesSizeCheck = filesSizeCheck;
const filesTypeCheck = (files, types) => {
    if (!files || !files.length)
        return false;
    return files.every((file) => {
        return types.includes(file.mimetype);
    });
};
exports.filesTypeCheck = filesTypeCheck;
//# sourceMappingURL=storage.js.map