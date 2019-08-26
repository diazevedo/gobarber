import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
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

    const userAppointments = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });
    return res.json(userAppointments);
  }
}

export default new AppointmentController();
