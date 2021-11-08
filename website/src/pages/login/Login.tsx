import { validationHelper } from '../../helpers';
import { userValidation } from '../../validations';

import { useState } from 'react';

type output = {
  path: string,
  message: string
}

const Login = () => {
  const [ error, setError ] = useState<string | null>(null);
  
  return (
    <form onSubmit={(event: any) => {
      event.preventDefault();

      // Error handling logic here
      validationHelper(event.target, userValidation, (output: output[]) => setError(output[0].message || 'Something went wrong.'));
    }}>
        <input name="name" type="text" />
        <input name="password" type="password" />
        <input type="text" name="email" />
        <input type="submit" />
        {error ? <p>{error}</p> : null}
    </form>
  );
}

export default Login;