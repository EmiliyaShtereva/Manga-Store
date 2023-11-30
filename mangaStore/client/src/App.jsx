import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import MangaListGenre from "./components/manga-list/MangaListGenre.jsx";
import About from "./components/static-pages/About.jsx";
import FAQ from "./components/static-pages/FAQ.jsx";
import Contact from "./components/static-pages/Contact.jsx";
import MangaDetails from "./components/manga-details/MangaDetails.jsx";
import Cart from "./components/cart/Cart.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import SignIn from "./components/sign-forms/SignIn.jsx";
import SignUp from "./components/sign-forms/SignUp.jsx";
import Logout from "./components/logout/Logout.jsx";

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/genre/:genre" element={<MangaListGenre />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/questions" element={<FAQ />} />
          <Route path="/details/:mangaId" element={<MangaDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/liked" element='' />
        </Routes>
    </AuthProvider>
  )
}

export default App
