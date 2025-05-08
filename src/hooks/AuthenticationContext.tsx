import {createContext, useState, useContext, type Dispatch,type SetStateAction,type ReactNode} from "react";

type AuthContextType = {
    accessToken: string;
    setAccessToken: Dispatch<SetStateAction<string>>;
    baseUrl: string;
    productionUrl: string;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthentication() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthentication must be used with a AuthProvider');
    }
    return context;
}

export function AuthenticationProvider({children}: {children: ReactNode}) {
    const [accessToken, setAccessToken] = useState<string>(' ');
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const productionUrl = import.meta.env.VITE_PRODUCTION_URL;

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log("data: ", data);
            setAccessToken(data.accessToken);
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    const logout = () => {
        setAccessToken('');
    };

    return (
        <AuthContext.Provider value={{
            accessToken,
            setAccessToken,
            baseUrl,
            productionUrl,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}