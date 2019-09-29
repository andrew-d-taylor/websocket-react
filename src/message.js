import React from 'react';

class Message extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li className="message">
				<div>Type: {this.props.label}</div>
				<div>Content: {this.props.content}</div>
				<div>{this.props.timestamp}</div>
			</li>
		);
	}
}

export default Message;