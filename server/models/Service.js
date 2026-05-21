import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { 
    type: String, 
    enum: ['Therapy', 'Assessment', 'Consultation', 'Other'],
    default: 'Therapy' 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
