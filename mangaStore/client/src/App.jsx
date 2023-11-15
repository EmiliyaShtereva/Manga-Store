import { Route, Routes } from "react-router-dom";
import HomePage from "./components/home-page/HomePage.jsx";
import Main from "./components/main/Main.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/genre" element=''>
          <Route path=":genre" element='' />
        </Route>
        <Route path="/newest" element='' />
        <Route path="/ongoing" element='' />
        <Route path="/completed" element='' />
        <Route path="/contact" element='' />
        <Route path="/about" element='' />
        <Route path="/questions" element='' />
        <Route path="/details" element=''>
          <Route path=":id" element='' />
        </Route>
        <Route path="/cart" element='' />
        <Route path="/liked" element='' />
      </Routes>
    </>
  )
}

export default App
