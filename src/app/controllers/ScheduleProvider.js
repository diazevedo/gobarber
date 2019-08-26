import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleProvider {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider.' });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const providerAgenda = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        cancelled_at: null,
        date: { [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)] },
      },
      order: ['date'],
    });

    return res.json(providerAgenda);
  }
}

export default new ScheduleProvider();
