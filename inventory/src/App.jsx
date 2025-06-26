import "bootstrap/dist/css/bootstrap.min.css";
import { createContext, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About";
import './App.css';
import Charts from "./components/Charts/Charts";
import Prediction from "./components/Charts/Prediction";
import Header from "./components/Header/Header";
import PrintInvoice from "./components/InvoicePrint/PrintInvoice";
import Bills from "./components/Jsxpages/Bills";
import BillView from "./components/Jsxpages/BillView";
import CustomerAdd from "./components/Jsxpages/CustomerAdd";
import CustomerList from "./components/Jsxpages/CustomerList";
import Details from "./components/Jsxpages/Details";
import ForgotPassword from './components/Jsxpages/ForgotPassword';
import InvoiceCreate from "./components/Jsxpages/InvoiceCreate";
import InvoiceList from "./components/Jsxpages/InvoiceList";
import LoginSignup from './components/Jsxpages/LoginSignup';
import Messages from "./components/Jsxpages/Messages";
import ProductAdd from "./components/Jsxpages/ProductAdd";
import ProductList from "./components/Jsxpages/ProductList";
import Profile from "./components/Jsxpages/Profile";
import SideBar from "./components/SideBar/SideBar";
import Contact from "./Contact";
import Footer from "./Footer";
import Home from "./Home";
import NavBar from "./NavBar";
import Dashboard from "./pages/Home/Dashboard";



export const MyContext = createContext();

function App() {
  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("accessToken") ? true : false;
  });

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <Router>
      <MyContext.Provider value={values}>
      
        {!isAuthenticated ? (
          <>
          <NavBar/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/about" element={<About isClicked={true} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes>
          <Footer/>
          </>
        ) : (
          <>
            <Header />
            <div className="main d-flex">
              <div className={`sidebarWrapper ${isToggleSidebar ? 'toggle' : ''}`}>
                <SideBar />
              </div>
              <div className={`content ${isToggleSidebar ? 'toggle' : ''}`}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/details" element={<Details />} />
                  <Route path="/customeradd" element={<CustomerAdd />} />
                  <Route path="/customerlist" element={<CustomerList />} />
                  <Route path="/invoicelist" element={<InvoiceList />} />
                  <Route path="/productlist" element={<ProductList />} />
                  <Route path="/invoicecreate" element={<InvoiceCreate />} />
                  <Route path="/productscreate" element={<ProductAdd />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/productview" element={<ProductList />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/bills" element={<Bills />} />
                  <Route path="/billview" element={<BillView />} />
                  <Route path='/invoice/:id/view' element={<PrintInvoice />} />
                  <Route path='/charts' element={<Charts />} />
                  <Route path='/predict' element={<Prediction />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </MyContext.Provider>
    </Router>
  );
}

export default App;
