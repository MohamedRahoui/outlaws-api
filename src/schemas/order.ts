import * as Yup from 'yup';
const formValidation = Yup.object({
  phone: Yup.string()
    .required('Votre N° de Téléphone est requis')
    .max(20, 'Votre N° de Téléphone ne peut pas dépasser 20 caractères')
    .min(6, 'Votre N° de Téléphone doit contenir au moins 6 caractères'),
  name: Yup.string()
    .max(40, 'Votre Nom ne peut pas dépasser 40 caractères')
    .min(3, 'Votre Nom doit contenir au moins 3 caractères')
    .required('Votre Nom est requis'),
  address: Yup.string()
    .max(150, 'Votre Adresse ne peut pas dépasser 150 caractères')
    .min(5, 'Votre Adresse doit contenir au moins 5 caractères')
    .required('Votre Adresse est requise'),
  email: Yup.string()
    .email('Veuillez insérer un E-mail valide')
    .required('Votre E-mail est requis'),
  rewardId: Yup.string().required('The reward is required'),
});

const orderErrors = (
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
export default orderErrors;
