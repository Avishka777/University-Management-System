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
import CreateAnnouncement from './pages/CreateAnnouncement';
import UpdateAnnouncement from './pages/UpdateAnnouncement';
import AnnouncementPage from './pages/AnnouncementPage';
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
          <Route path='/create-announcement' element={<CreateAnnouncement />} />
          <Route path='/update-announcement/:announcementId' element={<UpdateAnnouncement />} />
        </Route>

        <Route path="/programmes" element={<Programmes/>}/>
        <Route path='/announcement/:announcementSlug' element={<AnnouncementPage />} />
        <Route path="/time-table" element={<TimeTable/>}/>

      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}