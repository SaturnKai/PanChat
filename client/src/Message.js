"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMessage = exports.ServerMessage = void 0;
const react_1 = __importDefault(require("react"));
const ServerMessage = ({ content }) => {
    return (<p className="message">
			<span className="server-header">SERVER</span> &gt; {content}
		</p>);
};
exports.ServerMessage = ServerMessage;
const ClientMessage = ({ currentUser, user, content }) => {
    if (currentUser)
        return (<p className="message current">
				<span className="current-client-header">USER {user}</span> &gt; {content}
			</p>);
    else
        return (<p className="message">
				<span className="client-header">USER {user}</span> &gt; {content}
			</p>);
};
exports.ClientMessage = ClientMessage;
