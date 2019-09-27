import React from 'react';
import ReactDOM from 'react-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './index.css';

import MessageLog from "./message-log";

class MessagesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.stompClient = null;
        this.newMessageContent = '';
        this.newMessageLabel = 'Note';
        this.state = {
            messages: []
        }
    }

    addMessage() {
        const newMessage = {
            content: this.newMessageContent,
            label: this.newMessageLabel,
            timestamp: new Date().toISOString()
        };
        const currentMessages = this.state.messages.concat();
        currentMessages.push(newMessage);
        this.setState({messages: currentMessages});
    }

    onOptionSelected(event) {
        this.newMessageLabel = event.target.value;
    }

    onMessageContentChange(event) {
        this.newMessageContent = event.target.value;
    }

    setConnected(value) {
        console.log('The client is now connected? ', value);
    }

    connect() {
        const socket = new SockJS('http://localhost:8080/andrew-stomp-endpoint');
        console.log('New socket is ', socket);
        this.stompClient = Stomp.over(socket);
        console.log('Stomp client is: ', this.stompClient);

        const self = this;
        this.stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            self.setConnected(true);
            self.stompClient.subscribe('/topic/messages', function (message) {
                self.onNewMessage(JSON.parse(message.body));
            });
        });
    }

    onNewMessage(message) {
        console.log('New message recieved: ', message);
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        this.setConnected(false);
        console.log("Disconnected");
    }

    sendMessage(message) {
        console.log('About to send message: ', message);
        this.stompClient.send("/app/messages/create", {});
    }

    render() {
        console.log('Current state of messages is: ', this.state.messages);
        return (
            <div>
                <div>
                    <select value={this.state.newMessageLabel} onChange={this.onOptionSelected.bind(this)}>
                        <option value='Note'>Note</option>
                        <option value='Memo'>Memo</option>
                    </select>
                    <input type='text' value={this.state.newMessageContent} onChange={this.onMessageContentChange.bind(this)}/>
                    <button onClick={this.addMessage.bind(this)}>Add Message</button>
                </div>
                <MessageLog messages={this.state.messages}/>
                <button onClick={this.connect.bind(this)}>Connect</button>
                <button onClick={this.disconnect.bind(this)}>Disconnect</button>
                <button onClick={this.sendMessage.bind(this)}>Send Message</button>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <MessagesComponent />,
  document.getElementById('root')
);
