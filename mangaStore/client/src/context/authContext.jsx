import { createContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import * as authService from '../services/authService.js';
import usePersistedState from "../hooks/usePersistedState.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = usePersistedState('accessToken', {});
    const [errorMessage, setErrorMessage] = useState('');

    const signInSubmitHandler = async (values) => {
        const result = await authService.login({ email: values.email, password: values.password });

        if (result?.code >= 400) {
            setErrorMessage(result.message);
        } else {
            setErrorMessage('');
            setAuth(result);
            navigate('/');
        }
    }

    const signUpSubmitHandler = async (values) => {
        const result = await authService.register({
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            address: values.address
        });

        if (result?.code >= 400) {
            setErrorMessage(result.message);
        } else {
            setErrorMessage('');
            setAuth(result);
            navigate('/');
        }
    }

    const logoutHandler = async () => {
        setAuth({});
        localStorage.removeItem('accessToken');
    }

    const values = {
        signInSubmitHandler,
        signUpSubmitHandler,
        logoutHandler,
        isAuthenticated: !!auth.accessToken,
        errorMessage
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;