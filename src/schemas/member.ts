import { PrismaClient } from '.prisma/client';
import { filesSizeCheck, filesTypeCheck } from '@src/tools/storage';
import * as Yup from 'yup';
const prisma = new PrismaClient();
const formValidation = Yup.object({
  name: Yup.string()
    .max(40, 'Votre Nom ne peut pas dépasser 40 caractères')
    .min(3, 'Votre Nom doit contenir au moins 3 caractères')
    .required('Votre Nom est requis'),
  email: Yup.string()
    .required('Votre E-mail est requis')
    .email('Veuillez insérer un E-mail valide')
    .test('Unique', 'Vous avez déjà envoyé une demande', async (email) => {
      const found = await prisma.member.findFirst({
        where: {
          email,
        },
      });
      return !found;
    }),
  address: Yup.string()
    .required('Votre Adresse est requis')
    .min(5, 'Votre Adresse doit contenir au moins 5 caractères')
    .max(150, 'Votre Adresse ne peut pas dépasser 150 caractères'),
  phone: Yup.string()
    .required('Votre N° de Téléphone est requis')
    .max(20, 'Votre N° de Téléphone ne peut pas dépasser 20 caractères')
    .min(6, 'Votre Nom doit contenir au moins 6 caractères'),
  birth: Yup.string()
    .max(12, 'Votre date de naissance est requise')
    .min(10, 'Votre date de naissance est requise')
    .required('Votre date de naissance est requise'),
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
  picture: Yup.mixed()
    .required('Votre photo est requise')
    .test(
      'file-size',
      'La taille des images ne doit pas depasser 20MB',
      (value) => filesSizeCheck([value], 20)
    )
    .test('file-type', 'Les images doivent être de type PNG ou JPG', (value) =>
      filesTypeCheck([value], ['image/png', 'image/jpeg'])
    ),
  social: Yup.string().max(
    40,
    'Votre Compte ne peut pas dépasser 40 caractères'
  ),
});

/* 
FIXME: Clean this up, and stop being lazy
*/
const memberErrors = (
  data: unknown
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
export default memberErrors;
