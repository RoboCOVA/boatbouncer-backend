import twilio from 'twilio';
import {
  fromPhoneNumber,
  twilioAccountSid,
  twilioAuthToken,
} from '../config/environments';

const client = twilio(twilioAccountSid, twilioAuthToken);

const SMSTemplates = {
  bookingRequest:
    '<requesterFirstName> <requesterLastName> is requesting a booking on BoatBouncer. Please visit boatbouncer.com to view your view bookings. \n https://boatbouncer.com/',
  offerSent:
    'An offer has been sent to you by <ownerFirstName> <ownerLastName>. Please check out on our website. \n https://boatbouncer.com/',
  offerAccepted:
    'You offer has been accepted by <firstName> <lastName> \n https://boatbouncer.com/',
  bookingCancellation:
    '<firstName> <lastName> has cancelled Booking request. \n https://boatbouncer.com/',
};

function fillTemplate(template, values) {
  return template.replace(/<([^>]+)>/g, (placeholder, key) => {
    return values[key] || placeholder;
  });
}

function createMessage(templateKey, values) {
  const template = SMSTemplates[templateKey];
  if (!template) {
    throw new Error('Template not found');
  }
  return fillTemplate(template, values);
}

async function notifyUsingMessage(phone, message) {
  try {
    await client.messages.create({
      body: message,
      from: fromPhoneNumber,
      to: phone,
    });
  } catch (error) {
    console.log('error occured sending message!');
  }
}

export function sendMessage(phone, templateKey, values) {
  const message = createMessage(templateKey, values);
  notifyUsingMessage(phone, message);
}
