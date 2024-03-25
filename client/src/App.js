"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Message_1 = require("./Message");
require("./App.css");
function App() {
    const socketRef = (0, react_1.useRef)(null);
    const currentIDRef = (0, react_1.useRef)('TEMP');
    const [messageInput, setMessageInput] = (0, react_1.useState)('');
    const [messages, setMessages] = (0, react_1.useState)([]);
    const onSubmit = (e) => {
        e.preventDefault();
        setMessages((prev) => [
            ...prev,
            {
                userID: currentIDRef.current,
                content: messageInput
            }
        ]);
        const socket = socketRef.current;
        socket === null || socket === void 0 ? void 0 : socket.send(messageInput);
        setMessageInput('');
    };
    const handleOnChange = (e) => {
        setMessageInput(e.target.value);
    };
    (0, react_1.useEffect)(() => {
        socketRef.current = new WebSocket('ws://localhost:3000');
        const socket = socketRef.current;
        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.event === 'id') {
                currentIDRef.current = data.id;
            }
            if (data.event === 'messages') {
                const mm = data.messages.map((m) => ({
                    userID: m.userId,
                    content: m.content
                }));
                setMessages((prev) => [...prev, ...mm]);
            }
            if (data.event === 'message') {
                if (data.user === currentIDRef.current)
                    return;
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
    return (<main>
			<div className="messages">
				<Message_1.ServerMessage content="Connection successful."/>
				{messages.map((message, index) => (<Message_1.ClientMessage key={index} currentUser={message.userID === currentIDRef.current} user={message.userID} content={message.content}/>))}
			</div>
			<form onSubmit={onSubmit}>
				<input className="messageInput" type="text" onChange={handleOnChange} value={messageInput} autoFocus={true}/>
			</form>
		</main>);
}
exports.default = App;
