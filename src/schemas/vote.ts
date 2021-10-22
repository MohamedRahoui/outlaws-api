import * as Yup from 'yup';
const formValidation = Yup.object({
  name: Yup.string().max(40, 'Votre Nom ne peut pas dépasser 40 caractères'),
  age: Yup.string().max(40, 'Votre age ne peut pas dépasser 40 caractères'),
  gender: Yup.string().max(
    40,
    'Votre genre ne peut pas dépasser 40 caractères'
  ),
  email: Yup.string().email('Veuillez insérer un E-mail valide'),
  love: Yup.string()
    .max(3000, 'Votre réponse ne peut pas dépasser 3000 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  right: Yup.string()
    .max(3000, 'Votre réponse ne peut pas dépasser 3000 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  choice: Yup.string()
    .max(3000, 'Votre réponse ne peut pas dépasser 3000 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
  recommendation: Yup.string()
    .max(3000, 'Votre réponse ne peut pas dépasser 3000 caractères')
    .min(5, 'Votre réponse doit contenir au moins 5 caractères')
    .required('Votre réponse est requise'),
});

const voteErrors = (
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
export default voteErrors;
