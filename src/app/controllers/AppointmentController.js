import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const userAppointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        cancelled_at: null,
      },
      attributes: ['id', 'date'],
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    res.json(userAppointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Error' });

    const { provider_id, date } = req.body;
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'The user sent is not a provider.' });
    }
    /**
     * iso transforms the date to a JS object date
     * start Hour removes any minute or seconds.
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date()))
      return res.status(401).json({ error: 'Past dates are not permitted.' });

    const checkAvailitiby = await Appointment.findOne({
      where: { provider_id, date: hourStart, cancelled_at: null },
    });

    if (checkAvailitiby)
      return res.status(401).json({ error: 'Date is not unavailable.' });

    const userAppointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(userAppointment);
  }
}

export default new AppointmentController();
