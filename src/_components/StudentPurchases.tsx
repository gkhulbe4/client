import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { course } from "models/course";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "@/constants";

type CourseData = {
    id: string,
    userId: string,
    courseId: string,
    isCompleted: boolean,
    createdAt: string,
    updatedAt: string,
    course: course
}

function StudentPurchases() {
  const userId = localStorage.getItem("id");
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["studentPurchases"],
    queryFn: async () => {
      const res = await axios.get(
        BACKEND_URL+`/student/purchases/${userId}`
      );
      console.log(res.data.studentPurchases);
      return res.data.studentPurchases;
    },
  });

  async function changeIsCompleted(courseId: string) {
    const res = await axios.put(
      BACKEND_URL+"/student/purchases/update",
      {
        courseId: courseId,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    queryClient.invalidateQueries({ queryKey: ['studentPurchases'] })
  }

  if (error) {
    return <h1>Error</h1>;
  }

  if (isLoading) {
    return <h1 className="h-screen">Students details are loading...</h1>;
  }
  return (
    <div className="flex flex-col gap-8 my-4">
      <h1 className="text-3xl font-extrabold text-center">
        Courses you are enrolled to :-
      </h1>
      {data.map((courseData:CourseData) => (
        <div key={courseData.id} className="flex flex-col gap-2">
          <div
            onClick={() =>
              navigate(`/course/dashboard/${courseData.course.id}`)
            }
            className={`w-full border-2 border-gray-200 px-3 py-4 rounded-3xl flex justify-around hover:bg-gray-200 transition-colors duration-300 ease-in-out cursor-pointer ${
              courseData.isCompleted ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <div className="flex flex-col w-full">
              <h1 className="font-semibold text-xl">
                {courseData.course.course_name}
              </h1>
              <h1 className="text-sm font-light">
                Description: {courseData.course.description}
              </h1>
              <h1 className="text-sm font-bold text-gray-600">
                Instructor: {courseData.course.instructor_name}
              </h1>
              <h1 className="text-sm font-bold text-gray-600">
                Due date: {courseData.course.duration}
              </h1>
            </div>
            <div className="h-36">
              <img
                src={courseData.course.thumbnail}
                className="h-full w-full object-contain"
                alt="Course image"
              />
            </div>
          </div>
          <div>
            <button
              onClick={() => changeIsCompleted(courseData.course.id)}
              className={`${
                courseData.isCompleted ? "bg-green-500" : "bg-red-500"
              } text-white text-sm font-bold py-3 px-3 rounded-xl ml-3`}
            >
              {courseData.isCompleted
                ? "Mark it as Not Completed"
                : "Mark it as Completed"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentPurchases;
