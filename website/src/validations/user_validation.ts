import * as yup from 'yup';

const userSchema = yup.object().shape({
  name: yup.string().strict().required(),
  email: yup.string().strict().email().required(),
  password: yup.string().strict().min(8).max(21).required()
});

export default userSchema;