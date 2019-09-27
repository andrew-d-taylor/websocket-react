import React from 'react';
import Message from './message';

class MessageLog extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.messages.map((rawMessage) => {
        return <Message label={rawMessage.label} content={rawMessage.content} timestamp={rawMessage.timestamp} key={rawMessage.timestamp}/>
      })
    );
  }
}

export default MessageLog;