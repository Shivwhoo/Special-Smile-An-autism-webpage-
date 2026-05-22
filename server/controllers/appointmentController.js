import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import { Resend } from 'resend';
import { createCalendarEvent } from '../utils/googleCalendar.js';

// @desc    Create new appointment & sync with Google Calendar
// @route   POST /api/appointments
// @access  Public (no auth required)
export const createAppointment = async (req, res) => {
  try {
    const { serviceId, childName, date, timeSlot, notes, parentName, parentEmail, parentPhone } = req.body;

    if (!parentName || !parentEmail) {
      return res.status(400).json({ message: 'Parent name and email are required.' });
    }
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // 1. Double-booking prevention
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      date: { $gte: startDate, $lte: endDate },
      timeSlot,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: 'This time slot is already booked for the selected date. Please choose a different slot or date.' 
      });
    }

    // 2. Create the appointment in DB as confirmed and paid (payment bypassed)
    const appointment = new Appointment({
      parentName,
      parentEmail,
      parentPhone,
      service: service._id,
      childName,
      date,
      timeSlot,
      notes,
      status: 'confirmed',
      paymentStatus: 'paid'
    });

    const createdAppointment = await appointment.save();

    // Populate service for calendar and email dispatches
    const populatedAppointment = await Appointment.findById(createdAppointment._id)
      .populate('service');

    // 3. Create Google Calendar Event
    let googleCalendarEventId = null;
    try {
      // Build a minimal user-like object for the calendar helper
      const parentInfo = { name: parentName, email: parentEmail, phone: parentPhone };
      googleCalendarEventId = await createCalendarEvent(
        populatedAppointment, 
        parentInfo, 
        populatedAppointment.service
      );
      if (googleCalendarEventId) {
        populatedAppointment.googleCalendarEventId = googleCalendarEventId;
        await populatedAppointment.save();
      }
    } catch (calErr) {
      console.error('Failed to sync with Google Calendar:', calErr);
    }

    // 4. Send Confirmation Emails using Resend
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const resend = (resendKey && resendKey !== 're_placeholder' && resendKey.trim() !== '') 
        ? new Resend(resendKey) 
        : null;

      if (resend) {
        const adminEmail = process.env.ADMIN_EMAIL || 'jaylovelypriya@gmail.com';
        
        // A. Send to Parent (May fail if unverified in Resend Sandbox)
        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: parentEmail,
            subject: 'Appointment Confirmed - Special Smile Center',
            html: `
              <div style="font-family: sans-serif; color: #2C3E50; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #FFB347; text-align: center; margin-top: 0;">Appointment Confirmed!</h2>
                <p>Dear ${parentName},</p>
                <p>Your booking for <strong>${populatedAppointment.service.title}</strong> at <strong>Special Smile Center</strong> has been successfully confirmed.</p>
                
                <div style="background-color: #FFFDF9; padding: 15px; border-radius: 8px; border: 1px solid #FFB347; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2C3E50;">Booking Details:</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold; width: 120px;">👶 Child Name:</td>
                      <td style="padding: 6px 0;">${populatedAppointment.childName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">📅 Date:</td>
                      <td style="padding: 6px 0;">${new Date(populatedAppointment.date).toDateString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">⏰ Time Slot:</td>
                      <td style="padding: 6px 0;">${populatedAppointment.timeSlot}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">📍 Location:</td>
                      <td style="padding: 6px 0;">Adarsh Vihar Colony, Lane No. 1, T-Point, Gola Road, Patna</td>
                    </tr>
                  </table>
                </div>

                ${populatedAppointment.notes ? `<p><strong>Additional Notes:</strong> <em>"${populatedAppointment.notes}"</em></p>` : ''}

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 14px; color: #7F8C8D; text-align: center;">
                  If you need to reschedule or cancel, please contact us at <strong>0612-4032920</strong>.
                </p>
                <p style="text-align: center; font-weight: bold; color: #FFB347; margin-top: 20px;">
                  Warm regards,<br>Dr. Lovely Priya<br>Special Smile Center
                </p>
              </div>
            `
          });
          console.log(`✅ Parent confirmation email sent successfully to: ${parentEmail}`);
        } catch (parentEmailErr) {
          console.warn(`⚠️ Parent email delivery failed (${parentEmail}):`, parentEmailErr.message || parentEmailErr);
          console.warn(`💡 Tip: Resend Sandbox only allows sending to the verified owner's email address (${adminEmail}). Verify a custom domain at resend.com to send to all clients!`);
        }

        // B. Send Notification to Admin/Doctor (Guaranteed to succeed in Sandbox since it goes to the owner's email)
        try {
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: adminEmail,
            subject: '🔔 New Appointment Scheduled - Special Smile Center',
            html: `
              <div style="font-family: sans-serif; color: #2C3E50; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; border-top: 4px solid #FFB347;">
                <h2 style="color: #2C3E50; text-align: center; margin-top: 0;">New Booking Received</h2>
                <p>Hello Dr. Lovely Priya,</p>
                <p>A new appointment has been scheduled at the Special Smile Center. Here are the booking details:</p>
                
                <div style="background-color: #FFFDF9; padding: 15px; border-radius: 8px; border: 1px solid #FFB347; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #2C3E50;">Appointment Details:</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold; width: 150px;">🩺 Program/Service:</td>
                      <td style="padding: 6px 0; font-weight: bold; color: #FFB347;">${populatedAppointment.service.title}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">👶 Child Name:</td>
                      <td style="padding: 6px 0;">${populatedAppointment.childName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">📅 Date:</td>
                      <td style="padding: 6px 0;">${new Date(populatedAppointment.date).toDateString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">⏰ Time Slot:</td>
                      <td style="padding: 6px 0;">${populatedAppointment.timeSlot}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">👤 Parent Name:</td>
                      <td style="padding: 6px 0;">${parentName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">📞 Parent Phone:</td>
                      <td style="padding: 6px 0;">${parentPhone || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-weight: bold;">✉️ Parent Email:</td>
                      <td style="padding: 6px 0;">${parentEmail}</td>
                    </tr>
                  </table>
                </div>

                ${populatedAppointment.notes ? `<p><strong>Parent Notes:</strong> <em>"${populatedAppointment.notes}"</em></p>` : ''}

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 13px; color: #7F8C8D; text-align: center;">
                  This appointment has been automatically synchronized with your Google Calendar and confirmed.
                </p>
              </div>
            `
          });
          console.log(`✅ Admin notification email sent successfully to: ${adminEmail}`);
        } catch (adminEmailErr) {
          console.warn('⚠️ Admin notification email failed:', adminEmailErr.message || adminEmailErr);
        }
      } else {
        console.log(`✉️ (Mock Mode) Resend API Key missing. Emails mock logged to console.`);
      }
    } catch (emailErr) {
      console.warn('⚠️ General email dispatcher error:', emailErr);
    }

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get booked slots for a specific date to disable occupied hours
// @route   GET /api/appointments/booked-slots
// @access  Public
export const getBookedSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      date: { $gte: startDate, $lte: endDate },
      status: { $in: ['confirmed', 'pending'] }
    });

    const bookedSlots = appointments.map((app) => app.timeSlot);
    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get appointments by parent email
// @route   GET /api/appointments/my
// @access  Public (lookup by email)
export const getMyAppointments = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required to look up appointments.' });
    }

    const appointments = await Appointment.find({ parentEmail: email })
      .populate('service')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
