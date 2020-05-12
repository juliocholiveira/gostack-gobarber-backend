import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '../repositories/AppointmentRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const router = Router();

router.use(ensureAuthenticated);

router.get('/', async (req, res) => {
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  res.json(await appointmentRepository.find());
});

router.post('/', async (req, res) => {
  try {
    const { providerId, date } = req.body;

    const parsedDate = parseISO(date);

    const createAppointmentService = new CreateAppointmentService();

    const appointment = await createAppointmentService.execute({ providerId, date: parsedDate });

    return res.json(appointment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
