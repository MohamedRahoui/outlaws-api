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
    .test('Unique', 'Vous avez déjà signé', async (email) => {
      const found = await prisma.trainee.findFirst({
        where: {
          email,
        },
      });
      return !found;
    }),
  phone: Yup.string()
    .required('Votre N° de Téléphone est requis')
    .max(20, 'Votre N° de Téléphone ne peut pas dépasser 20 caractères')
    .min(6, 'Votre Nom doit contenir au moins 6 caractères'),
  social: Yup.string().max(
    40,
    'Votre Compter ne peut pas dépasser 40 caractères'
  ),
  birth: Yup.string()
    .max(12, 'Votre date de naissance est requise')
    .min(10, 'Votre date de naissance est requise')
    .required('Votre date de naissance est requise'),
  address: Yup.string()
    .max(150, 'Votre Adresse ne peut pas dépasser 150 caractères')
    .min(5, 'Votre Adresse doit contenir au moins 5 caractères')
    .required('Votre Adresse est requise'),
  degree: Yup.string()
    .max(150, 'Votre réponse ne peut pas dépasser 150 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  speciality: Yup.string()
    .max(300, 'Votre réponse ne peut pas dépasser 300 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  availability: Yup.string()
    .max(100, 'Votre réponse ne peut pas dépasser 100 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  letter: Yup.string()
    .max(3000, 'Votre réponse ne peut pas dépasser 3000 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  cv: Yup.array()
    .min(1, 'Votre CV est requis')
    .required('Votre CV est requis')
    .test(
      'file-size',
      'La taille du fichier ne doit pas depasser 5MB',
      (value) => filesSizeCheck(value, 5)
    )
    .test('file-type', 'Le fichier doit être de type PDF', (value) =>
      filesTypeCheck(value, ['application/pdf'])
    ),
});

/* 
FIXME: Stop copying the same code instead of reusing it
Story time for my grand kids: Whenever I decided to make this
a reusable function, I ended up getting distracted by something else.
So I came to the conclusion that this fucntion, Is god and wants to be 
copy pasted all over my project to protect it. And I respected that.
Facts for adults: I just don't wanna fucking do it, and made this shit up
so I don't look stupid when someone's read this :)
*/
const traineeErrors = (
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
export default traineeErrors;
