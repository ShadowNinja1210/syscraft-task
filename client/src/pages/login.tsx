import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loginFormSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const login = async () => {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data);

      if (data.token) {
        localStorage.setItem(
          "syscraftToken",
          JSON.stringify({ token: data.token, email: data.email, role: data.role })
        );
        navigate("/");
      }
    };

    login();
    console.log(values);
  }

  return (
    <main className="w-screen flex flex-col items-center">
      <Card className="w-[340px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <Input {...field} type="email" />
                    <FormMessage>{form.getFieldState("email").error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <div className="flex">
                      <Input className=" rounded-r-none" {...field} type={isPasswordVisible ? "text" : "password"} />
                      <Button
                        size="icon"
                        type="button"
                        variant="outline"
                        className=" rounded-l-none text-neutral-900"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      >
                        {isPasswordVisible ? <Eye /> : <EyeClosed />}
                      </Button>
                    </div>
                    <FormMessage>{form.getFieldState("password").error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
