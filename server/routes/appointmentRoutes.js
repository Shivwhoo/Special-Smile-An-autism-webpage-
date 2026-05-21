import express from 'express';
import { createAppointment, getBookedSlots, getMyAppointments } from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createAppointment);

router.get('/booked-slots', getBookedSlots);

router.get('/my', protect, getMyAppointments);

export default router;
