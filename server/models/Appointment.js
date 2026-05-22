import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  childName: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  googleCalendarEventId: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
