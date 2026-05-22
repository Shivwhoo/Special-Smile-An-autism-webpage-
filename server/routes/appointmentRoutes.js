import express from 'express';
import { createAppointment, getBookedSlots, getMyAppointments } from '../controllers/appointmentController.js';

const router = express.Router();

router.route('/')
  .post(createAppointment);

router.get('/booked-slots', getBookedSlots);

router.get('/my', getMyAppointments);

export default router;
