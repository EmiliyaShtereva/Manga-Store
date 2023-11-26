import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import Main from "./components/main/Main.jsx";
import MangaListGenre from "./components/manga-list/MangaListGenre.jsx";
import About from "./components/static-pages/About.jsx";
import FAQ from "./components/static-pages/FAQ.jsx";
import Contact from "./components/static-pages/Contact.jsx";
import MangaDetails from "./components/manga-details/MangaDetails.jsx";
import Cart from "./components/cart/Cart.jsx";
import { useState } from "react";
import * as authService from './services/authService';
import AuthContext from "./context/authContext.js";
import SignIn from "./components/sign-forms/SignIn.jsx";
import SignUp from "./components/sign-forms/SignUp.jsx";
import Logout from "./components/logout/Logout.jsx";

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    localStorage.removeItem('accessToken');
    return {};
  });

  const signInSubmitHandler = async (values) => {
    const result = await authService.login({ email: values.email, password: values.password })
    setAuth(result);
    localStorage.setItem('accessToken', result.accessToken);
    navigate('/home');
  }

  const signUpSubmitHandler = async (values) => {
    const result = await authService.register({ 
      email: values.email, 
      password: values.password, 
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      address: values.address
    })
    setAuth(result);
    localStorage.setItem('accessToken', result.accessToken);
    navigate('/home');
  }

  const logoutHandler = async () => {
    setAuth({});
    localStorage.removeItem('accessToken');
    navigate('/home');
  }

  const values = {
    signInSubmitHandler,
    signUpSubmitHandler,
    logoutHandler,
    isAuthenticated: !!auth.accessToken
  }

  return (
    <AuthContext.Provider value={values}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/genre/:genre" element={<MangaListGenre />} />
          <Route path="/newest" element='' />
          <Route path="/coming-soon" element='' />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/questions" element={<FAQ />} />
          <Route path="/details/:mangaId" element={<MangaDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/liked" element='' />
        </Routes>
    </AuthContext.Provider>
  )
}

export default App
