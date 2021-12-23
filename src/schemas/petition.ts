import prisma from '@src/tools/dbClient';
import { IPetitionSchema } from '@src/tools/models';
import { filesSizeCheck, filesTypeCheck } from '@src/tools/storage';
import * as Yup from 'yup';
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
    .min(
      1,
      "Votre N° d'inscription aux listes électorales doit contenir au moins 1 caractères"
    )
    .max(
      40,
      "Votre N° d'inscription aux listes électorales ne peut pas dépasser 40 caractères"
    )
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
    .test(
      'file-size',
      'La taille des images ne doit pas depasser 20MB',
      (files) => filesSizeCheck(files, 20)
    )
    .test('file-type', 'Les images doivent être de type PNG ou JPG', (files) =>
      filesTypeCheck(files, ['image/png', 'image/jpeg'])
    ),
  signature: Yup.mixed().required('Votre Signature manuscrite est requise'),
  user_id: Yup.string()
    .uuid()
    .test('ValidUser', 'Valid User', async (userId) => {
      const found = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      return !!found;
    }),
});

/* 
FIXME: Clean this up, and stop being lazy
*/
const petitionErrors = (
  data: IPetitionSchema
): Promise<{ data: unknown; errors: unknown }> => {
  return new Promise<{ data: unknown; errors: unknown }>((resolve) => {
    formValidation
      .validate(data, {
        abortEarly: false,
        stripUnknown: true,
      })
      .then((obj) => resolve({ data: obj, errors: null }))
      .catch((err) => {
        if (err instanceof Yup.ValidationError) {
          let errors = err.inner.map((error) => {
            return { field: error.path as string, message: error.message };
          });
          const seen = new Set();
          errors = errors.filter((error) => {
            const duplicate = seen.has(error.field);
            seen.add(error.field);
            return !duplicate;
          });

          const formattedErrors: { [key: string]: string } = {};
          errors.forEach((e) => {
            formattedErrors[e.field] = e.message;
          });
          resolve({ data: null, errors: formattedErrors });
        } else {
          console.log(err);
        }
      });
  });
};
export default petitionErrors;
