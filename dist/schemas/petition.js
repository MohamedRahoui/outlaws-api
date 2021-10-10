"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require(".prisma/client");
const storage_1 = require("@src/tools/storage");
const Yup = __importStar(require("yup"));
const prisma = new client_1.PrismaClient();
const formValidation = Yup.object({
    firstname: Yup.string()
        .required('Votre Pénom est requis')
        .min(3, 'Votre Pénom doit contenir au moins 3 caractères')
        .max(40, 'Votre Pénom ne peut pas dépasser 40 caractères'),
    lastname: Yup.string()
        .required('Votre Nom est requis')
        .min(3, 'Votre Nom doit contenir au moins 3 caractères')
        .max(40, 'Votre Nom ne peut pas dépasser 40 caractères'),
    address: Yup.string()
        .required('Votre Adresse est requis')
        .min(5, 'Votre Adresse doit contenir au moins 5 caractères')
        .max(150, 'Votre Adresse ne peut pas dépasser 150 caractères'),
    email: Yup.string()
        .required('Votre E-mail est requis')
        .email('Veuillez insérer un E-mail valide')
        .test('Unique', 'Vous avez déjà signé', async (email) => {
        const found = await prisma.petition.findFirst({
            where: {
                email,
            },
        });
        return !found;
    }),
    cin: Yup.string()
        .required('Votre CIN est requis')
        .max(12, 'Votre CIN ne peut pas dépasser 12 caractères')
        .min(6, 'Votre CIN doit contenir au moins 6 caractères')
        .test('Unique', 'Vous avez déjà signé', async (cin) => {
        const found = await prisma.petition.findFirst({
            where: {
                cin,
            },
        });
        return !found;
    }),
    electoral_number: Yup.string()
        .required("Votre N° d'inscription aux listes électorales est requis")
        .min(1, "Votre N° d'inscription aux listes électorales doit contenir au moins 1 caractères")
        .max(40, "Votre N° d'inscription aux listes électorales ne peut pas dépasser 40 caractères")
        .test('Unique', 'Vous avez déjà signé', async (electoral_number) => {
        const found = await prisma.petition.findFirst({
            where: {
                electoral_number,
            },
        });
        return !found;
    }),
    identity_card: Yup.array()
        .length(2, 'Votre carte didentité est requise (Recto et Verso)')
        .required('Votre carte didentité est requise (Recto et Verso)')
        .test('file-size', 'La taille des images ne doit pas depasser 20MB', (files) => (0, storage_1.filesSizeCheck)(files, 20))
        .test('file-type', 'Les images doivent être de type PNG ou JPG', (files) => (0, storage_1.filesTypeCheck)(files, ['image/png', 'image/jpeg'])),
    signature: Yup.mixed().required('Votre Signature manuscrite est requise'),
});
const petitionErrors = (data) => {
    return new Promise((resolve) => {
        formValidation
            .validate(data, {
            abortEarly: false,
            stripUnknown: true,
        })
            .then((obj) => resolve({ data: obj, errors: null }))
            .catch((err) => {
            if (err instanceof Yup.ValidationError) {
                let errors = err.inner.map((error) => {
                    return { field: error.path, message: error.message };
                });
                const seen = new Set();
                errors = errors.filter((error) => {
                    const duplicate = seen.has(error.field);
                    seen.add(error.field);
                    return !duplicate;
                });
                const formattedErrors = {};
                errors.forEach((e) => {
                    formattedErrors[e.field] = e.message;
                });
                resolve({ data: null, errors: formattedErrors });
            }
            else {
                console.log(err);
            }
        });
    });
};
exports.default = petitionErrors;
//# sourceMappingURL=petition.js.map