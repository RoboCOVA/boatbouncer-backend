import React from 'react';
import { Box, Text, Label } from '@adminjs/design-system';
import styled from 'styled-components';

const ConversationContainer = styled(Box)`
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  background: white;
  margin: 16px 0 32px 0;
`;

const MessagesContainer = styled(Box)`
  max-height: 600px;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-top: 16px;
`;

const MessageBox = styled(Box)`
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  max-width: 80%;
`;

const SenderMessage = styled(MessageBox)`
  background-color: #e3f2fd;
  margin-left: auto;
`;

const ReceiverMessage = styled(MessageBox)`
  background-color: #f5f5f5;
  margin-right: auto;
`;

const MessageHeader = styled(Box)`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EmailBadge = styled.span`
  background-color: ${(props) => (props.isSender ? '#2196f3' : '#757575')};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

const Conversations = (props) => {
  const { record } = props;
  const messages = record.messages || [];
  const member1 = record.populated['members.0'].params;
  const member2 = record.populated['members.1'].params;

  return (
    <ConversationContainer>
      <Label
        mb="xl"
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        Conversation between {member1?.email} and {member2?.email}
      </Label>

      <MessagesContainer>
        <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {messages.map((message, index) => {
            const isMember1 = message.sender === member1?._id;
            const MessageComponent = isMember1
              ? SenderMessage
              : ReceiverMessage;

            return (
              <MessageComponent key={message._id || index}>
                <MessageHeader>
                  <EmailBadge isSender={isMember1}>
                    {isMember1 ? member1?.email : member2?.email}
                  </EmailBadge>
                </MessageHeader>
                <Text>{message?.text}</Text>
                <Text
                  style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}
                >
                  {new Date(message?.createdAt).toLocaleString()}
                </Text>
              </MessageComponent>
            );
          })}

          {messages.length === 0 && (
            <Box style={{ textAlign: 'start', padding: '0px 20px' }}>
              <Text>No messages in this conversation</Text>
            </Box>
          )}
        </Box>
      </MessagesContainer>
    </ConversationContainer>
  );
};

export default Conversations;
