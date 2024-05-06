import CourseDashboard from "./_components/CourseDashboard";
import CourseList from "./_components/CourseList";
import StudentDashboard from "./_components/StudentDashboard";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Signin from "./_components/Signin";
import Signup from "./_components/Signup";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BACKEND_URL } from "./constants";

function App() {
console.log("BACKEND_URL",BACKEND_URL);
  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/courses" element={<CourseList/>} />
        <Route path="/student/dashboard/:userId" element={<StudentDashboard/>}/>
        <Route path="course/dashboard/:courseId" element={<CourseDashboard/>}/>
      </Routes>
      <Footer />
    </Router>
  </>
  )
}

export default App
