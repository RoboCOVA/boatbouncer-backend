import twilio from 'twilio';
import { twilioAccountSid, twilioAuthToken } from '../config/environments';

const client = twilio(twilioAccountSid, twilioAuthToken);

const SMSTemplates = {
  bookingRequest:
    'A booking has been requested by <requesterFirstName> <requesterLastName>. Please check out on our website.',
  offerSent:
    'An offer has been sent to you by <ownerFirstName> <ownerLastName>. Please check out on our website.',
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

function notifyUsingMessage(phone, message) {
  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

export function sendMessage(phone, templateKey, values) {
  const message = createMessage(templateKey, values);
  notifyUsingMessage(phone, message);
}
