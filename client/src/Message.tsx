import React from 'react';

interface ServerMessageProps {
	content: string;
}

interface ClientMessageProps {
	currentUser: boolean;
	user: string;
	content: string;
}

export const ServerMessage: React.FC<ServerMessageProps> = ({ content }) => {
	return (
		<p className="message">
			<span className="server-header">SERVER</span> &gt; {content}
		</p>
	);
};

export const ClientMessage: React.FC<ClientMessageProps> = ({ currentUser, user, content }) => {
	if (currentUser)
		return (
			<p className="message current">
				<span className="current-client-header">USER {user}</span> &gt; {content}
			</p>
		);
	else
		return (
			<p className="message">
				<span className="client-header">USER {user}</span> &gt; {content}
			</p>
		);
};
