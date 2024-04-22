import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Header from "./components/Header"
import Courses from "./pages/Courses"
import Footer from "./components/Footer"
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreateAnnouncement from './pages/CreateAnnouncement';
import CreateCourse from './pages/CreateCourse';
import UpdateAnnouncement from './pages/UpdateAnnouncement';
import AnnouncementPage from './pages/AnnouncementPage';
import Search from './pages/Search';
import UpdateCourse from "./pages/UpdateCourse"
import CoursePage from "./pages/CoursePage"
import CreateTimetable from "./pages/CreateTimetable"
import CreateClassroom from "./pages/CreateClassroom"
import Timetables from "./pages/Timetables"
import UpdateTimetable from "./pages/UpdateTimetable"

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
          <Route path='/create-course' element={<CreateCourse />} />
          <Route path='/create-timetable' element={<CreateTimetable />} />
          <Route path='/create-classroom' element={<CreateClassroom />} />
          <Route path='/update-announcement/:announcementId' element={<UpdateAnnouncement />} />
          <Route path='/update-course/:courseId' element={<UpdateCourse />} />
          <Route path='/update-timetable/:timetableId' element={<UpdateTimetable />} />
        </Route>
        
        <Route path="/courses" element={<Courses/>}/>
        <Route path='/announcement/:announcementSlug' element={<AnnouncementPage />} />
        <Route path='/course/:courseSlug' element={<CoursePage />} />
        <Route path="/timetables" element={<Timetables/>}/>

      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}
