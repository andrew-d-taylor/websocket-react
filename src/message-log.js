import React from 'react';
import Message from './message';

class MessageLog extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="messageLog">
        <div>Messages</div>
        <ul>
          {this.props.messages.map((rawMessage) => {
            return <Message label={rawMessage.label} content={rawMessage.content} timestamp={rawMessage.timestamp} key={rawMessage.timestamp}/>
          })}
        </ul>
      </div>
    );
  }
}

export default MessageLog;