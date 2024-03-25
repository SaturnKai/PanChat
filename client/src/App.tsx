import React, { useState, useEffect, useRef } from 'react';
import { ServerMessage, ClientMessage } from './Message';
import './App.css';

interface ClientMessagePayload {
	userID: string;
	content: string;
}

export default function App() {
	const socketRef = useRef<WebSocket | null>(null);
	const currentIDRef = useRef<string>('TEMP');

	const [messageInput, setMessageInput] = useState<string>('');
	const [messages, setMessages] = useState<ClientMessagePayload[]>([]);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setMessages((prev) => [
			...prev,
			{
				userID: currentIDRef.current,
				content: messageInput
			}
		]);

		const socket = socketRef.current;
		socket?.send(messageInput);

		setMessageInput('');
	};

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setMessageInput(e.target.value);
	};

	useEffect(() => {
		socketRef.current = new WebSocket('ws://localhost:3000');
		const socket = socketRef.current;

		socket.onmessage = (e) => {
			const data = JSON.parse(e.data);
			if (data.event === 'id') {
				currentIDRef.current = data.id;
			}
			if (data.event === 'messages') {
				const mm = data.messages.map((m: { userId: string; content: string }) => ({
					userID: m.userId,
					content: m.content
				}));
				setMessages((prev) => [...prev, ...mm]);
			}
			if (data.event === 'message') {
				if (data.user === currentIDRef.current) return;

				setMessages((prev) => [
					...prev,
					{
						userID: data.user,
						content: data.content
					}
				]);
			}
		};

		return () => {
			socket.close();
		};
	}, []);

	return (
		<main>
			<div className="messages">
				<ServerMessage content="Connection successful." />
				{messages.map((message, index) => (
					<ClientMessage
						key={index}
						currentUser={message.userID === currentIDRef.current}
						user={message.userID}
						content={message.content}
					/>
				))}
			</div>
			<form onSubmit={onSubmit}>
				<input
					className="messageInput"
					type="text"
					onChange={handleOnChange}
					value={messageInput}
					autoFocus={true}
				/>
			</form>
		</main>
	);
}
