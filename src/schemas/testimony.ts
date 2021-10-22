import * as Yup from 'yup';
const formValidation = Yup.object({
  name: Yup.string().max(40, 'Votre Nom ne peut pas dépasser 40 caractères'),
  age: Yup.string().max(10, 'Votre age ne peut pas dépasser 10 caractères'),
  city: Yup.string().max(40, 'Votre Ville ne peut pas dépasser 40 caractères'),
  text: Yup.string()
    .max(1000, 'Votre témoignage ne peut pas dépasser 1000 caractères')
    .min(5, 'Votre témoignage doit contenir au moins 5 caractères')
    .required('Votre témoignage est requis'),
});

const testimonyErrors = (
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
export default testimonyErrors;
