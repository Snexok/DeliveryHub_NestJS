import "./App.css";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/Main";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  );
}

export default App;
