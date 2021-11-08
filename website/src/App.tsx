import './assets/css/main.css';
import { AuthMiddleware } from './middlewares';

/* import { validationHelper } from './helpers';
import { userValidation } from './validations'; */

function App() {
  return (
    <AuthMiddleware>
{/*       <form onSubmit={event => {
        event.preventDefault();

        validationHelper(event.target, userValidation, console.log);
      }}>
        <input name="name" type="text" />
        <input name="password" type="password" />
        <input type="text" name="email" />
        <input name="grc" type="submit" />
      </form> */}
    </AuthMiddleware>
  );
}

export default App;