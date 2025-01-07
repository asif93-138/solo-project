import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./pages/Home.tsx";
import Layout from "./pages/Layout.tsx";
import Login from "./pages/Login.tsx";
import ContextProvider from "./context/UserContext.tsx";
import Registration from "./pages/Registration.tsx";
import Details from "./pages/Details.tsx";
import "@smastrom/react-rating/style.css";
import Mylist from "./pages/MyList.tsx";

createRoot(document.getElementById("root")!).render(
  <ContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="details/:id" element={<Details />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="user" element={<Mylist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ContextProvider>
);
