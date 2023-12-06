import { useContext, useEffect } from "react";
import AuthContext from "../../context/authContext";
import * as authService from '../../services/authService';
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();
    const {logoutHandler} = useContext(AuthContext);

    useEffect(() => {
        authService.logout()
            .then(() => {
                logoutHandler();
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                navigate('/something-went-wrong');
            });
    }, []);

    return null;
}