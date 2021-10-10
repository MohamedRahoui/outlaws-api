"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = exports.GetFiles = exports.GetAll = exports.Create = void 0;
const client_1 = require(".prisma/client");
const petition_1 = __importDefault(require("@src/schemas/petition"));
const checks_1 = require("@src/tools/checks");
const storage_1 = require("@src/tools/storage");
const sharp_1 = __importDefault(require("sharp"));
const prisma = new client_1.PrismaClient();
const Create = async (req, res) => {
    const myFiles = req.files;
    const { errors, data } = await (0, petition_1.default)(Object.assign(Object.assign({}, req.body), { identity_card: myFiles.filter((file) => file.fieldname.includes('identity_card')), signature: myFiles.find((file) => file.fieldname === 'signature') }));
    if (errors)
        return res.status(422).send(errors);
    if (!data)
        return res.status(400).send();
    const body = data;
    const createInput = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        address: body.address,
        cin: body.cin,
        electoral_number: body.electoral_number,
    };
    if (req.user) {
        createInput['userId'] = req.user.id;
    }
    const createdPetition = await prisma.petition.create({
        data: createInput,
    });
    if (!createdPetition)
        return res.status(400).send('Unable to sign');
    const identity_card = myFiles.filter((file) => file.fieldname.includes('identity_card'));
    if (identity_card.length !== 2)
        return res.status(403).send('Malicious attempt');
    const signature = myFiles.find((file) => file.fieldname === 'signature');
    if (!signature)
        return res.status(422).send({
            signature: 'Votre Signature manuscrite est requise',
        });
    for (const file of identity_card) {
        file.buffer = await (0, sharp_1.default)(file.buffer).webp({ quality: 20 }).toBuffer();
    }
    signature.buffer = await (0, sharp_1.default)(signature.buffer)
        .webp({ quality: 20 })
        .toBuffer();
    const uploadUrl = `petitions/${createdPetition.id}/`;
    for (const file of identity_card) {
        await (0, storage_1.UploadFile)(file.buffer, uploadUrl + file.fieldname + '.webp');
    }
    await (0, storage_1.UploadFile)(signature.buffer, uploadUrl + signature.fieldname + '.webp');
    res.status(200).send('Successfull signature');
};
exports.Create = Create;
const GetAll = async (req, res) => {
    if (!(0, checks_1.IsStaff)(req))
        return res.status(403).send('Access Denied');
    const petitons = await prisma.petition.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
    return res.status(200).send(petitons || []);
};
exports.GetAll = GetAll;
const GetFiles = async (req, res) => {
    if (!(0, checks_1.IsStaff)(req))
        return res.status(403).send('Access Denied');
    const uuid = req.params.uuid || '';
    if (!uuid)
        return res.status(422).send('No petition selected');
    const petiton = await prisma.petition.findFirst({
        where: {
            id: uuid,
        },
    });
    if (!petiton)
        return res.status(422).send('Invalid Petition');
    const uri = `petitions/${uuid}/`;
    const Querys = [
        (0, storage_1.getS3Object)(`${uri}identity_card_1.webp`),
        (0, storage_1.getS3Object)(`${uri}identity_card_2.webp`),
        (0, storage_1.getS3Object)(`${uri}signature.webp`),
    ];
    const files = await Promise.all(Querys).catch(() => {
        return res.status(400).send('Failed to get files');
    });
    return res.status(200).send(files || []);
};
exports.GetFiles = GetFiles;
const Validate = async (req, res) => {
    if (!(0, checks_1.IsStaff)(req))
        return res.status(403).send('Access Denied');
    const petitionId = req.body.id || null;
    if (!petitionId)
        return res.status(400).send('Missing petition ID');
    const validate = req.body.validate;
    const updated = await prisma.petition.update({
        where: {
            id: petitionId,
        },
        data: {
            valid: validate,
        },
    });
    if (!updated)
        return res.status(400).send('Failed query');
    return res.status(200).send('Validation changed');
};
exports.Validate = Validate;
//# sourceMappingURL=petitionsController.js.map