import axios from 'axios';
import { AuthenticationProvider } from '../hooks/AuthenticationContext.js';



const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const { response, config } = error;

        if (response?.status === 401 || response?.status === 403) {
            try {
                console.log("Authentication failed! Attempting token refresh...");
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
                    { withCredentials: true }
                );

                console.log("refreshResponse: ",refreshResponse);

                const { accessToken, message } = refreshResponse.data;

                console.log("newAccess Token: ",accessToken);
                const authContext = getAuthContext();
                if (authContext?.setAccessToken) {
                    authContext.setAccessToken(accessToken);
                }

                console.log("Beter Response message: ",message);

                config.headers['Authorization'] = `Bearer ${accessToken}`;
                return  axiosInstance(config); // Retry original request
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                const authContext = getAuthContext();
                if (authContext?.logout()){
                    authContext.logout();
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
