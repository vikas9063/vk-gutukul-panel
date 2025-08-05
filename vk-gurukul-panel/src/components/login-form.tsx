"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Apple, Home, Loader2 } from "lucide-react";
import apiClient from "@/lib/AxiosUtils";
import { useRouter } from "next/navigation";



const formSchema = z.object({
  username: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(25, { message: "Password must not be more than 25 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {

  const router = useRouter(); 

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
// Initialize Next.js router
  console.log("Login submit:", values);

  try {
    const res = await apiClient.post(`/auth/login`, values);
    console.log("Login response:", res.data);

    // Encrypt and store tokens
    if (res.data?.accessToken) {
      localStorage.setItem("TOKEN", res.data.accessToken);
    }
    if (res.data?.refreshToken) {
      localStorage.setItem("REFRESH_TOKEN", res.data.refreshToken);
    }

    // Redirect to dashboard
    router.push("/secured/dashboard");

  } catch (error: any) {
    console.error("Login error:", error);
  }
}

  const { isSubmitting } = form.formState;

  return (
    <div
      className={cn(
        "flex flex-col gap-6 items-center justify-center",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Login to your Acme Inc account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              aria-busy={isSubmitting}
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          {/* OR Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="w-full" disabled={isSubmitting}>
              <Apple className="mr-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full" disabled={isSubmitting}>
              <Home className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </CardFooter>
      </Card>
      <p className="text-center text-xs text-muted-foreground mt-2">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default LoginForm;
