import * as yup from 'yup';

export = yup.object({
  name: yup.string().strict().required(),
  password: yup.string().strict().min(8).max(20).required(),
  email: yup.string().strict().email().required()
});
