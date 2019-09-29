import React from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import './index.css';

import MessageLog from "./message-log";

class MessagesComponent extends React.Component {

    constructor(props) {
        super(props);
        this.stompClient = null;
        this.state = {
            messages: [],
            connected: false,
            newMessageContent: '',
            newMessageLabel: 'Note',
            websocketServerName: 'http://localhost:8080/andrew-stomp-endpoint'
        }
    }

    connect() {
        const socket = new SockJS(this.state.websocketServerName);
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, (frame) => {
            console.log('Connected: ', frame);
            this.setConnected(true);
            this.stompClient.subscribe('/app/messages', (frame) => {
                const initialMessages = JSON.parse(frame.body);
                console.log('Subscribed to messages', initialMessages);
                initialMessages.map((msg) => {
                    this.onNewMessage(msg);
                });
            });
            this.stompClient.subscribe('/topic/messages', (message) => {
                this.onNewMessage(JSON.parse(message.body));
            });
        });
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        this.setConnected(false);
        console.log("Disconnected");
    }

    onNewMessage(message) {
        console.log('New message received: ', message);
        const newMessages = this.state.messages.concat();
        newMessages.unshift(message);
        this.setState({messages: newMessages});
    }

    addMessage() {
        const message = {
            label: this.state.newMessageLabel,
            content: this.state.newMessageContent,
            timestamp: new Date().toISOString()
        };
        console.log("Sending message: ", message);
        this.stompClient.send("/app/messages/create", {}, JSON.stringify(message));
        this.setState({newMessageContent: ''});
    }

    setConnected(value) {
        console.log('The client is now connected? ', value);
        this.setState({connected: value, messages: []});
    }

    onOptionSelected(event) {
        this.setState({newMessageLabel: event.target.value});
    }

    onMessageContentChange(event) {
        this.setState({newMessageContent: event.target.value});
    }

    onWebsocketServerNameChange(event) {
        this.setState({websocketServerName: event.target.value});
    }

    render() {
        console.log('Current state of messages is: ', this.state.messages);
        return (
            <div className={this.state.connected ? "connected" : ""}>
                <div className="connectionDetails">
                    <label htmlFor="websocketServerName">Websocket Server</label>
                    <input id="websocketServerName" type="text" value={this.state.websocketServerName} onChange={this.onWebsocketServerNameChange.bind(this)}/>
                    <div>
                        <button disabled={this.state.connected} onClick={this.connect.bind(this)}>Connect</button>
                        <button disabled={!this.state.connected} onClick={this.disconnect.bind(this)}>Disconnect</button>
                    </div>
                </div>
                <div className="newMessageContent">
                    <div>Create a new message</div>
                    <div className="newMessageForm">
                        <select value={this.state.newMessageLabel} onChange={this.onOptionSelected.bind(this)}>
                            <option value='Note'>Note</option>
                            <option value='Memo'>Memo</option>
                        </select>
                        <input type='text' value={this.state.newMessageContent} onChange={this.onMessageContentChange.bind(this)}/>
                    </div>
                    <button disabled={!this.state.connected || this.state.newMessageContent.length === 0} onClick={this.addMessage.bind(this)}>Add Message</button>
                </div>
                <MessageLog messages={this.state.messages}/>
            </div>
        );
    }
}

export default MessagesComponent;