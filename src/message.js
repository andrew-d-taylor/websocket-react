import React from 'react';

class Message extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<li>
				<div>{this.props.label}</div>
				<div>{this.props.content}</div>
				<div>{this.props.timestamp}</div>
			</li>
		);
	}
}

export default Message;