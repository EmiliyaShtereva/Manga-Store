import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import Catalog from "./components/catalog/Catalog.jsx";
import About from "./components/static-pages/About.jsx";
import FAQ from "./components/static-pages/FAQ.jsx";
import Contact from "./components/static-pages/Contact.jsx";
import MangaDetails from "./components/manga-details/MangaDetails.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import SignIn from "./components/sign-forms/SignIn.jsx";
import SignUp from "./components/sign-forms/SignUp.jsx";
import Logout from "./components/logout/Logout.jsx";
import Create from "./components/create/Create.jsx";
import AuthGuards from "./components/guards/AuthGuards.jsx";
import Page404 from "./components/Page404/Page404.jsx";
import Purchase from "./components/manga-details/purchase/Purchase.jsx";
import Edit from "./components/manga-details/edit/Edit.jsx";
import Search from "./components/navbar/search/Search.jsx";
import SomethingWentWrong from "./components/something-went-wrong/SomethingWentWrong.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/questions" element={<FAQ />} />
        <Route path="/details/:mangaId" element={<MangaDetails />} />

        <Route element={<AuthGuards />}>
          <Route path="/logout" element={<Logout />} />
          <Route path="/create" element={<Create />} />
          <Route path="/purchase/:mangaId" element={<Purchase />} />
          <Route path="/edit/:mangaId" element={<Edit />} />
        </Route>

        <Route path="/something-went-wrong" element={<SomethingWentWrong />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
