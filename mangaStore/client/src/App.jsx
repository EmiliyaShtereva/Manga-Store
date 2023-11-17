import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import Main from "./components/main/Main.jsx";
import MangaListGenre from "./components/manga-list/MangaListGenre.jsx";
import MangaListStatus from "./components/manga-list/MangaListStatus.jsx";
import About from "./components/static-pages/About.jsx";
import FAQ from "./components/static-pages/FAQ.jsx";
import Contact from "./components/static-pages/Contact.jsx";
import MangaDetails from "./components/manga-details/MangaDetails.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/genre/:genre" element={<MangaListGenre />} />
        <Route path="/newest" element='' />
        {/* <Route path="/status/:status" element={<MangaListStatus />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/questions" element={<FAQ />} />
        <Route path="/details/:mangaId" element={<MangaDetails />} />
        <Route path="/cart" element='' />
        <Route path="/liked" element='' />
      </Routes>
    </>
  )
}

export default App
