"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import React from 'react';
const client_1 = __importDefault(require("react-dom/client"));
const App_tsx_1 = __importDefault(require("./App.tsx"));
require("./index.css");
// ReactDOM.createRoot(document.getElementById('root')!).render(
// 	<React.StrictMode>
// 		<App />
// 	</React.StrictMode>
// );
client_1.default.createRoot(document.getElementById('root')).render(<App_tsx_1.default />);
