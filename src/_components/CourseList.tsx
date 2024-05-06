import axios from "axios";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { course } from "../../models/course";
import useCourseStore from "../../utils/courseStore";

function CourseList() {
  const { auth } = useCourseStore((state) => ({
    auth: state.auth,
  }));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/course/all");
      console.log(res.data.courses);
      return res.data.courses;
    },
  });

  if (error) {
    return <h1>Error</h1>;
  }
  if (isLoading) {
    return <h1>Courses are loading</h1>;
  }

  if (auth === false) {
    setTimeout(() => {
      navigate("/signin");
    }, 3000);
    return (
      <h1 className="h-screen">Please sign in to see all the courses. Redirecting you to the sign-in page...</h1>
    )
  }

  const filteredCourses = data.filter((course: course) =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-start items-center gap-7 p-5 sm:p-10">
      <div className="w-full sm:w-[80%]">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-400 bg-gray-200 text-gray-500 px-5 py-4 w-full rounded-3xl outline-none"
          placeholder="Search a course"
        />
      </div>
      <div className="flex flex-col gap-7 w-full sm:w-[70%] mb-5">
        {filteredCourses.map((course: course) => (
          <div
            key={course.id}
            onClick={() => navigate(`/course/dashboard/${course.id}`)}
            className={`w-full border-2 border-gray-200 ${
              course.enrollmentStatus === "OPEN" && "hover:border-green-500"
            } ${
              course.enrollmentStatus === "IN_PROGRESS" &&
              "hover:border-yellow-500"
            } ${
              course.enrollmentStatus === "CLOSED" && "hover:border-red-500"
            } px-3 py-4 rounded-3xl flex justify-around hover:bg-gray-200 transition-colors duration-300 ease-in-out  cursor-pointer`}
          >
            <div className="flex flex-col">
              <h1
                className={`${
                  course.enrollmentStatus === "OPEN" && "text-green-500"
                } ${
                  course.enrollmentStatus === "IN_PROGRESS" && "text-yellow-500"
                } ${
                  course.enrollmentStatus === "CLOSED" && "text-red-500"
                } font-bold w-max`}
              >
                {course.enrollmentStatus}
              </h1>
              <h1 className="font-semibold text-xl">{course.course_name}</h1>
              <h1 className="text-sm font-light">
                Description: {course.description}
              </h1>
              <h1 className="text-sm font-bold text-gray-600">
                Instructor: {course.instructor_name}
              </h1>
            </div>

            <div className="object-contain">
              <img src={course.thumbnail} className="h-full w-full" alt="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
