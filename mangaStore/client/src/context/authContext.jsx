import { createContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import * as authService from '../services/authService.js';
import * as mangaService from '../services/mangaService.js';
import usePersistedState from "../hooks/usePersistedState.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = usePersistedState('accessToken', {});
    const [errorMessage, setErrorMessage] = useState('');
    const [searchInfo, setSearchInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const signInSubmitHandler = async (values) => {
        await authService.login({ email: values.email, password: values.password })
            .then((result) => {
                if (result?.code >= 400) {
                    setErrorMessage(result.message);
                } else {
                    setErrorMessage('');
                    setAuth(result);
                    navigate('/');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            });
    }

    const signUpSubmitHandler = async (values) => {
        await authService.register({
            email: values.email,
            password: values.password,
            firstName: values.firstName,
            lastName: values.lastName,
            username: values.username,
            address: values.address
        })
            .then((result) => {
                if (result?.code >= 400) {
                    setErrorMessage(result.message);
                } else {
                    setErrorMessage('');
                    navigate('/sign-in');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            });
    }

    const logoutHandler = async () => {
        await authService.logout()
            .then((result) => {
                setAuth(result);
                localStorage.removeItem('accessToken');
            })
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            });
    }

    const searchHandler = async (values) => {
        setIsLoading(true);
        await mangaService.getSearch(values.search)
            .then(result => {
                setSearchInfo(result);
                navigate('/search');
            })
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            })
            .finally(() => setIsLoading(false))
    }

    const values = {
        signInSubmitHandler,
        signUpSubmitHandler,
        logoutHandler,
        searchHandler,
        searchInfo,
        isLoading,
        isAuthenticated: !!auth.accessToken,
        username: auth.username,
        userId: auth._id,
        user: auth,
        errorMessage
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;