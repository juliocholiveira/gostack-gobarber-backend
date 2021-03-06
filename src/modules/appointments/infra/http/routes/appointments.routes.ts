import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';
import AppointmentRepository from '@modules/appointments/repositories/AppointmentRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const router = Router();

router.use(ensureAuthenticated);

router.get('/', async (req, res) => {
  const appointmentRepository = getCustomRepository(AppointmentRepository);
  res.json(await appointmentRepository.find());
});

router.post('/', async (req, res) => {
  const { providerId, date } = req.body;

  const parsedDate = parseISO(date);

  const createAppointmentService = new CreateAppointmentService();

  const appointment = await createAppointmentService.execute({ providerId, date: parsedDate });

  return res.json(appointment);
});

export default router;
