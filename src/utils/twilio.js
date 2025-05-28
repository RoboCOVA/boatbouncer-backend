import twilio from 'twilio';
import {
  fromPhoneNumber,
  frontendUrl,
  twilioAccountSid,
  twilioAuthToken,
} from '../config/environments';

const client = twilio(twilioAccountSid, twilioAuthToken);

const SMSTemplates = {
  bookingRequest:
    `<requesterFirstName> <requesterLastName> is requesting a booking on BoatBouncer.\n` +
    `Boat: <boatName>\n` +
    `Duration: <duration>\n\n` +
    `Please visit to view your bookings.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,

  offerSent:
    `An offer has been sent to you by <ownerFirstName> <ownerLastName>.\n` +
    `Boat: <boatName>\n` +
    `Duration: <duration>\n` +
    `Departure: <departureTime>\n\n` +
    `Please check out on our website.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=renter`,

  offerAccepted:
    `Your offer has been accepted by <firstName> <lastName>.\n` +
    `Boat: <boatName>\n` +
    `Duration: <duration>\n` +
    `Departure: <departureTime>\n\n` +
    `View booking details:\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,

  // offerAccepted: `You offer has been accepted by <firstName> <lastName> \n ${frontendUrl}/`,
  bookingCancellation:
    `<firstName> <lastName> has cancelled Booking request.\n` +
    `Boat: <boatName>\n`,

  notifyRenter:
    `Reminder: Your departure is in <remainingTime>.\n` +
    `Boat Owner: <ownerFirstName> <ownerLastName>\n` +
    `Departure Time: <departureTime>\n` +
    `Duration: <duration>\n\n` +
    `Please make sure all belongings are packed and the property is left in good condition. Safe travels!\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=renter`,

  notifyOwner:
    `Notice: The renter will be departing in <remainingTime>.\n` +
    `Renter: <renterFirstName> <renterLastName>\n` +
    `Departure Time: <departureTime>\n` +
    `Duration: <duration>\n\n` +
    `Please prepare for their departure and ensure the property is ready for the next steps.\n` +
    `${frontendUrl}/bookings?bookingId=<bookingId>&type=owner`,
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
