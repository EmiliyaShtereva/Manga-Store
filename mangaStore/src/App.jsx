import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import Main from "./components/Main.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home-page" element={<HomePage />}>
        </Route>
      </Routes>
    </>
  )
}

export default App
