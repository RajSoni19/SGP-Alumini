import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./styles/style.css";
import "react-toastify/dist/ReactToastify.css";
import Home from './components/Home';
import Footer from './components/Footer';
import Header from "./components/Header";
import AlumniList from "./components/AlumniList";
import Gallery from "./components/Gallery";
import Careers from "./components/Careers";
import Forum from "./components/Forum";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MyAccount from "./components/MyAccount";
import View_Event from "./components/view/View_Event";
import View_Forum from "./components/view/View_Forum";
import { AuthProvider, useAuth } from './AuthContext';
import ScrollToTop from "./components/ScrollToTop";
import 'react-quill/dist/quill.snow.css';
import { ThemeProvider } from "./ThemeContext";
import NotFound from "./components/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function AppRouter() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return (
    <>
      <Header />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Home />} />
        <Route path="/alumni" element={<AlumniList />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/jobs" element={<Careers />} />
        <Route path="/forums" element={<Forum />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="events/view" element={<View_Event />} />
        {isLoggedIn && <Route path="account" element={<MyAccount />} />}
        <Route path="forum/view" element={<View_Forum />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
