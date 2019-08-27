import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import checkTokenMD from './app/middlewares/jwt';
import ProviderController from './app/controllers/ProviderController';
import multerConfig from './config/multer';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleProvider from './app/controllers/ScheduleProvider';
import NotificationController from './app/controllers/NotificationController';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/', UserController.show);
routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

/**
 * Checks if the user session is valid
 * Since here it will be applied in all requests
 */
routes.use(checkTokenMD);

/**
 * upload.single() => receives the name of the field that has the file
 */
routes.post('/files', upload.single('file'), FileController.store);
routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments/', AppointmentController.index);
routes.get('/schedule/provider', ScheduleProvider.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

export default routes;
