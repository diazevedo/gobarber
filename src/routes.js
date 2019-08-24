import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import checkTokenMD from './app/middlewares/jwt';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', UserController.show);
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

/**
 * upload.single() => receives the name of the field that has the file
 */
routes.post(
  '/files',
  checkTokenMD,
  upload.single('file'),
  FileController.store
);

routes.put('/users', checkTokenMD, UserController.update);

export default routes;
