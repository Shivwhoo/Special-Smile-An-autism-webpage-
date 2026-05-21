import { google } from 'googleapis';

/**
 * Creates a Google Calendar event for a confirmed appointment using a Service Account JWT.
 * Degrads gracefully if credentials are not configured.
 * 
 * @param {Object} appointment - The populated appointment document from Mongoose
 * @param {Object} user - The populated user document
 * @param {Object} service - The populated service document
 * @returns {Promise<string|null>} Google Calendar Event ID or null
 */
export const createCalendarEvent = async (appointment, user, service) => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  // Gracefully skip if credentials are not configured
  if (!email || !privateKey || !calendarId || 
      email.includes('placeholder') || 
      calendarId.includes('placeholder')) {
    console.warn('⚠️ Google Calendar Integration skipped: Credentials not fully configured in server/.env');
    return null;
  }

  try {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    
    // Resolve escaped newlines and strip surrounding quotes commonly found in .env files
    const formattedPrivateKey = privateKey
      .trim()
      .replace(/^["']|["']$/g, '')
      .replace(/\\n/g, '\n');

    const auth = new google.auth.JWT({
      email,
      key: formattedPrivateKey,
      scopes
    });

    await auth.authorize();

    const calendar = google.calendar({ version: 'v3', auth });

    // Parse appointment Date
    const appointmentDate = new Date(appointment.date);
    
    // Format date in Asia/Kolkata timezone to get the correct local YYYY-MM-DD
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(appointmentDate);
    const yearStr = parts.find(p => p.type === 'year').value;
    const monthStr = parts.find(p => p.type === 'month').value;
    const dayStr = parts.find(p => p.type === 'day').value;
    const dateString = `${yearStr}-${monthStr}-${dayStr}`;

    // Parse timeSlot (e.g. "10:00 AM" or "02:00 PM")
    const [timeStr, modifier] = appointment.timeSlot.split(' ');
    let [hoursStr, minutesStr] = timeStr.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const pad = (n) => String(n).padStart(2, '0');
    
    // Construct ISO Start String with +05:30 (India Standard Time)
    const startIso = `${dateString}T${pad(hours)}:${pad(minutes)}:00+05:30`;

    // Construct ISO End String (calculate using service durationMinutes or default to 60 mins)
    const durationMin = service?.durationMinutes || 60;
    let endHours = hours;
    let endMinutes = minutes + durationMin;
    if (endMinutes >= 60) {
      endHours += Math.floor(endMinutes / 60);
      endMinutes = endMinutes % 60;
    }
    const endIso = `${dateString}T${pad(endHours)}:${pad(endMinutes)}:00+05:30`;

    const event = {
      summary: `Special Smile Booking: ${service.title} - ${appointment.childName}`,
      location: 'Adarsh Vihar Colony, Lane No. 1, T-Point, Gola Road, Patna',
      description: `Appointment confirmed at Special Smile Center.\n\n` +
                   `• Service: ${service.title}\n` +
                   `• Duration: ${durationMin} minutes\n` +
                   `• Child Name: ${appointment.childName}\n` +
                   `• Parent Name: ${user.name}\n` +
                   `• Parent Phone: ${user.phone || 'N/A'}\n` +
                   `• Additional Notes: ${appointment.notes || 'None'}`,
      start: {
        dateTime: startIso,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endIso,
        timeZone: 'Asia/Kolkata',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }        // 1 hour before
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log(`✅ Google Calendar Event created successfully: ${response.data.id}`);
    return response.data.id;
  } catch (error) {
    console.error('❌ Error creating Google Calendar event:', error);
    return null; // Return null so the main booking flow does not fail for the user
  }
};
