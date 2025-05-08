import { createContext, useContext, useEffect, useState } from "react";
import client from "../components/messaging/client.js";
import AuthService from "../services/AuthService.js";
import axios from "axios";

const BASE_URL = AuthService.BASE_URL;
const ACCESS_TOKEN = AuthService.getAccessToken();
const WebSocketContext = createContext(undefined);


export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};

export const WebSocketProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [contacts, setContacts] = useState([]); // Store contacts

    const username = AuthService.getUserName();
    const myEuniqueId = AuthService.getUserId()?.toString();
    const [selectedUserEuniqueId, setSelectedUserEuniqueId] = useState(null); // Manage selected user ID
    const [notification, setNotification] = useState(null);






    const reconnectWebSocket = () => {
        if (username && !client.connected) {
            client.onConnect = () => {
                client.publish({
                    destination: "/app/chat.addUser",
                    body: JSON.stringify({
                        euniqueId: myEuniqueId,
                        username,
                        status: "ONLINE",
                    }),
                });

                client.subscribe( `/user/${myEuniqueId}/queue/messages`,onPrivateMessageReceived);
                client.subscribe("/public/topic", onPublicMessageReceived);
            };

            client.activate();
            console.log("WebSocket reconnected successfully.");
        }
    };

    const addSellerToMyChats = (contactInfo) => {
        if (client.connected) {
            client.publish({
                destination: "/app/user.addContact",
                body: JSON.stringify(contactInfo),
            });
        } else {
            console.error("WebSocket client is not connected. Cannot add seller to chats.");
        }
    };

    const findAndDisplayMyContacts = async () => {

        try {
            const myContactsResponse = await axios.get(`${BASE_URL}/my-contacts/${myEuniqueId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${ACCESS_TOKEN}`,
                        withCredentials: true
                    }
                });
            const myContacts = myContactsResponse.data;

            setContacts(myContacts); // Save contacts to state
        }catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        // Fetch contacts on component mount
        findAndDisplayMyContacts();
    }, []); // Empty dependency array ensures this runs only once when the component mounts


    const fetchAndDisplayUserChat = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/messages/${myEuniqueId}/${selectedUserEuniqueId}`,{

                headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`},
                withCredentials: true
            });

            const userChat = response.data;
            console.log('userChat: ', userChat);
            setMessages(userChat);

        }catch(error) {
            console.error("Error fetching chats:", error);
        }
    }

    useEffect(() => {
        reconnectWebSocket();

        if (username) {
            const connectWebSocket = async () => {
                try {
                    client.onConnect = () => {
                        client.publish({
                            destination: "/app/chat.addUser",
                            body: JSON.stringify({euniqueId: myEuniqueId, username: username, status: 'ONLINE'}),
                        });

                        client.subscribe(`/user/${myEuniqueId}/queue/messages`, onPrivateMessageReceived);
                        client.subscribe("/public/topic", onPublicMessageReceived);
                    };
                    await client.activate();
                } catch (error) {
                    console.error("WebSocket connection error:", error);
                }
            };

            connectWebSocket();

            return () => {
                client.deactivate();
                localStorage.removeItem("username");
            };
        }
    }, [username]);


    const sendMessage = (messageContent) => {
        if (!client.connected) {
            console.error("WebSocket is not connected. Attempting to reconnect...");
            reconnectWebSocket();
            return;
        }

        if (messageContent.trim() && selectedUserEuniqueId) {
            const chatMessage = {
                senderEuniqueId: myEuniqueId,
                receiverEuniqueId: selectedUserEuniqueId,
                content: messageContent.trim(),
                timestamp: new Date().toISOString(),
            };

            console.log("Sending message:", chatMessage);

            client.publish({
                destination: "/app/chat",
                body: JSON.stringify(chatMessage),
            });

            // Update the systemNotification state to include the new message
            setMessages((prevMessages) => [...prevMessages, chatMessage]);

            setMessage(""); // Clear input field
        }
    };


    const onPrivateMessageReceived = async (payload) => {
        await findAndDisplayMyContacts();
        const message = JSON.parse(payload.body);


        // Append the new message to the existing systemNotification
        // TODO: CHECK IF THE MESSAGE SENDERID IS THE  SELECTED USER ID NDIO USI APPEND HIO MESSAGE KWA THE WRONG CHATS
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, message];
            return updatedMessages;
        });
    };

    const onPublicMessageReceived = async (payload) => {
        await findAndDisplayMyContacts();
        const message = JSON.parse(payload.body);
        if (message.status === "ONLINE") {
            setNotification(`${message.username} joined`);
        }
    };


    return (
        <WebSocketContext.Provider
            value={{
                messages,
                sendMessage,
                setMessages,
                message,
                setMessage,
                username,
                addSellerToMyChats,
                contacts,
                setSelectedUserEuniqueId,
                selectedUserEuniqueId,
                fetchAndDisplayUserChat,
                notification,
                setNotification,
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};