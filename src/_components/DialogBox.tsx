import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

type Props = {
    courseId: string,
    price: number,
    status: string
}

export function DialogBox({courseId , price , status}:Props) {
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  async function purchaseCourse() {
    try {
      const res = await axios.post(
        "http://localhost:3000/course/purchase",
        {
          userId: userId,
          courseId: courseId
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      setTimeout(() => {
        navigate(`/student/dashboard/${userId}`);
      }, 1000);
    } catch (error: unknown) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error);
      }
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={status === "IN_PROGRESS" || status === "CLOSED"} className="bg-blue-400 px-4 py-5 rounded-xl text-white font-bold border border-blue-500 hover:bg-blue-500">
          Enroll for ${price}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Enrollment</DialogTitle>
          <DialogDescription>
            Do you want to enroll to this course ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="bg-blue-400 px-4 py-3 rounded-xl text-white font-bold border border-blue-500 hover:bg-blue-500"
            onClick={() => purchaseCourse()}
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster richColors position="top-center" expand={true} />
    </Dialog>
  );
}
