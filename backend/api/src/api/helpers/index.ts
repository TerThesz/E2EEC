import routerSwitch from './router_switch';

const { error, success } = require('./status');
const { sha256, sha512, generate_random_string, generate_salt, generate_pepper, get_pepper } = require('./hash');

export { routerSwitch, error, success, sha256, sha512, generate_random_string, generate_salt, generate_pepper, get_pepper }
