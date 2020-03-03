import { Router } from 'express';
import multer from 'multer';
import cors from 'cors';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import checkTokenMD from './app/middlewares/jwt';
import ProviderController from './app/controllers/ProviderController';
import multerConfig from './config/multer';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleProvider from './app/controllers/ScheduleProvider';
import NotificationController from './app/controllers/NotificationController';
import AvailabilityController from './app/controllers/AvailabilityController';

const routes = new Router();
const upload = multer(multerConfig);

const whitelist = [
  'https://digobarber.netlify.com',
  'https://didevgobarber.netlify.com',
];

const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

routes.get('/', cors(corsOptions), UserController.show);
routes.post('/sessions', cors(corsOptions), SessionController.store);
routes.post('/users', cors(corsOptions), UserController.store);
/**
 * Checks if the user session is valid
 * Since here it will be applied in all requests
 */
routes.use(checkTokenMD);

/**
 * upload.single() => receives the name of the field that has the file
 */
routes.post(
  '/files',
  cors(corsOptions),
  upload.single('file'),
  FileController.store
);
routes.put('/users', cors(corsOptions), UserController.update);
routes.get('/providers', cors(corsOptions), ProviderController.index);

routes.post('/appointments', cors(corsOptions), AppointmentController.store);
routes.get('/appointments/', cors(corsOptions), AppointmentController.index);
routes.delete(
  '/appointments/:id',
  cors(corsOptions),
  AppointmentController.delete
);
routes.get(
  '/appointments/:providerId/availability/',
  cors(corsOptions),
  AvailabilityController.index
);

routes.get('/schedule/provider', cors(corsOptions), ScheduleProvider.index);

routes.get('/notifications', cors(corsOptions), NotificationController.index);
routes.put(
  '/notifications/:id',
  cors(corsOptions),
  NotificationController.update
);

export default routes;
