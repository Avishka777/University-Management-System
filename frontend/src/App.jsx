import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Header from "./components/Header"
import Programmes from "./pages/Programmes"
import TimeTable from "./pages/TimeTable"
import Footer from "./components/Footer"
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route path="/programmes" element={<Programmes/>}/>
        <Route path="/time-table" element={<TimeTable/>}/>

      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}