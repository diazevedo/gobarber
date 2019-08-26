import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const userAppointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
      },
    });
    res.json(userAppointments);
  }
}

export default new AppointmentController();
