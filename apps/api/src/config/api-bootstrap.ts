import { loadRootEnv, validateRequiredEnv, logConfigSource } from './load-root-env';

loadRootEnv();
validateRequiredEnv();
logConfigSource((msg) => console.log(msg));
