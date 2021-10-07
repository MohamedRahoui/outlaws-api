"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const Upload = (req, res, next) => {
    const upload = (0, multer_1.default)({
        limits: {
            fieldSize: 20 * 1024 * 1024,
            fileSize: 20 * 1024 * 1024,
            files: 5,
        },
    }).any();
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE')
                return res.status(422).send([
                    {
                        field: err.field || '',
                        message: 'La taille du fichier ne doit pas depasser 20MB',
                    },
                ]);
            return res.status(422).send([
                {
                    field: err.field || '',
                    message: 'Veillez choisir un autre fichier',
                },
            ]);
        }
        if (err)
            return res.status(400).send();
        next();
    });
};
exports.default = Upload;
//# sourceMappingURL=upload.js.map