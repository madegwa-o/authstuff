import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AuthService from "../../services/AuthService.js";

const URL = `${AuthService.BASE_URL}/ws`

const client = new Client({
    brokerURL: URL,
    connectHeaders: {},
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
    webSocketFactory: () => new SockJS(URL),
});

export default client;