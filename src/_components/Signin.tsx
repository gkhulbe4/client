import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signinSchema } from "../../schema/index";
import useCourseStore from "../../utils/courseStore";

type signin = z.infer<typeof signinSchema>;
function Signin() {
  const [view, setView] = useState<boolean>(false);
  const { auth, setAuth } = useCourseStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
  }));
  const navigate = useNavigate();

  const form = useForm<signin>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "john@gmail.com",
      password: "123",
    },
  });

  async function onSubmit(data: signin) {
    const email = data.email;
    const password = data.password;
    try {
      const res = await axios.post(
        "http://localhost:3000/student/signin",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", res.data.token);
      setAuth(true);
      localStorage.setItem("id", res.data.userId);
      navigate("/courses");
    } catch (error: unknown) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error);
      }
    }
  }

  if (auth === true)
    return (
      <div className="min-h-screen">
        {" "}
        You are already signed in. Please logout to signin with an account.
      </div>
    );

  return (
    <div className="flex flex-col items-start justify-center min-h-screen bg-gradient-to-b from-white to-red-300 bg-gray-700 gap-2">
      <h1 className="text-center w-full text-2xl font-extrabold text-gray-700">
        Please signin to your account
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md mx-auto p-8 border border-gray-500 rounded-xl bg-black backdrop-filter backdrop-blur-lg bg-opacity-20"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <Input
                    className="border border-gray-400 bg-opacity-20 bg-black placeholder-white text-gray-200 font-extralight text-sm rounded-xl py-5 px-3 w-full outline-none tracking-wider focus:ring-2 focus:ring-gray-300"
                    placeholder="Enter email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="relative">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center">
                  <FormControl>
                    <Input
                      type={view ? "text" : "password"}
                      className="border border-gray-400 bg-opacity-20 bg-black placeholder-white text-gray-200 font-extralight text-sm rounded-xl py-5 px-3 w-full outline-none tracking-wider focus:ring-2 focus:ring-gray-300"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div
              className="absolute top-3 right-3 w-max text-sm text-gray-200 cursor-pointer"
              onClick={() => setView(!view)}
            >
              {view ? "Hide" : "Show"}
            </div>
          </div>
          <Button
            className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 hover:scale-110 transition-all duration-300 ease-in-out"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
      <Toaster richColors position="top-center" expand={true} />
    </div>
  );
}

export default Signin;
