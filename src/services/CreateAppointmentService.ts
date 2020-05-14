import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentRepository';

interface Request {
  providerId: string;
  date: Date;
}

class CreateAppointmentService {

  public async execute({ providerId, date }: Request) : Promise<Appointment> {
    const appointmentRepository = getCustomRepository(AppointmentRepository);

    const dateStartHour = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRepository.findByDate(dateStartHour);

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is ready booked.');
    }

    const appointment = appointmentRepository.create({
      providerId,
      date: dateStartHour,
    });

    await appointmentRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
