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
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreateNotification from './pages/CreateNotification';
import UpdateNotification from './pages/UpdateNotification';
import NotificationPage from './pages/NotificationPage';
import Search from './pages/Search';

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/sign-in" element={<SignIn />}/>
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>

        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path='/create-notification' element={<CreateNotification />} />
          <Route path='/update-notification/:notificationId' element={<UpdateNotification />} />
        </Route>

        <Route path="/programmes" element={<Programmes/>}/>
        <Route path='/notification/:notificationSlug' element={<NotificationPage />} />
        <Route path="/time-table" element={<TimeTable/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}