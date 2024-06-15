import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const disableSMSTemporary = true;

const SMSTemplates = {
  bookingRequest:
    'A booking has been requested by <requesterFirstName> <requesterLastName>. Please check out on our website.',
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
  if (disableSMSTemporary) return;

  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

export function sendMessage(phone, templateKey, values) {
  const template = SMSTemplates[templateKey];
  if (!template) {
    throw new Error('Template not found');
  }

  const message = createMessage(template, values);

  notifyUsingMessage(phone, message);
}
