import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../../schemas/Notification';

import Mail from '../../lib/Mail';

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
    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'Users cannot schedule appointment with thems.' });
    }

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

    const { name } = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "dd 'de' MMMM', às 'H:mm'h'", {
      locale: pt,
    });

    /** Notify provider */
    await Notification.create({
      content: `Novo agendamento de ${name} para o dia ${formattedDate}`,
      user: provider_id,
    });

    return res.json(userAppointment);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({
        error: 'No appointment id sent.',
      });
    }

    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    });
    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot cancel this appointment' });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You cannot cancel appointments only two hour before it.',
      });
    }

    appointment.cancelled_at = new Date();
    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      text: 'Novo cancelamento',
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
