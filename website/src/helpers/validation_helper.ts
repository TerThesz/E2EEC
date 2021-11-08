async function validationHelper(formObject: any, schema: any, cb: Function) {
  if (!schema) throw 'Give schema >:(';
  
  const inputs = Array.from(formObject.querySelectorAll('input')).filter((input: any) => input.type != 'button' && input.type != 'submit');
  const inputObjects = {};

  inputs.forEach((input: any) => inputObjects[input.name || 'null'] = input.value);
  if (inputObjects['null']) throw 'Give name >:(\n';

  try {
    await schema.validate(inputObjects, { abortEarly: false });
    return cb(null);
  } catch (err) {
    const errors: Array<Object> = [];

    err.inner.forEach((inner: any) => {
      errors.push({ path: inner.path, message: inner.message })
      if (!Object.keys(inputObjects).includes(inner.path)) throw 'Element does not exits >:(\n' + inner;
    });

    return cb(errors === [] ? null : errors);
  }
}

export default validationHelper;