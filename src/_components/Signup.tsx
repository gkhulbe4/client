import { useState, useEffect } from "react";
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
import { signupSchema } from '../../schema/index';
import useCourseStore from '../../utils/courseStore';


type signup = z.infer<typeof signupSchema>;
function Signup() {
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [view, setView] = useState<boolean>(false);
    const { auth } = useCourseStore((state) => ({
      auth: state.auth,
    }));
  const navigate = useNavigate();

    useEffect(() => {
      if (auth === true) {
        navigate("/courses");
      }
    }, [auth, navigate]);

  const form = useForm<signup>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: signup) {
    const name = data.name;
    const email = data.email;
    const password = data.password;
    if (checkbox === false) {
      toast.info("Please accept the terms and confitions");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/student/signup",
        {
          name: name,
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error);
      }
    }
  }

  return (
    <div
      className="flex flex-col items-start justify-center min-h-screen bg-gradient-to-b from-white to-red-300 bg-gray-700 gap-2"
    >
      <h1 className="text-center w-full text-2xl font-extrabold text-gray-700">
        Please signup to create an account
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-md mx-auto p-8 border border-gray-500 rounded-xl bg-black backdrop-filter backdrop-blur-lg bg-opacity-20"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center">
                <FormControl>
                  <Input
                    className="border border-gray-400 bg-opacity-20 bg-black placeholder-white text-white font-extralight text-sm rounded-xl py-5 px-3 w-full outline-none tracking-wider focus:ring-2 focus:ring-gray-300 "
                    placeholder="Enter name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
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
          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              checked={checkbox}
              onClick={() => setCheckbox(!checkbox)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
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

export default Signup;
