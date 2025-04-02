import { useState } from "react";
// Remove useNavigate if it's no longer used elsewhere in this component after the change
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Keep Link
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, EyeOff, Eye, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Keep if using "Remember me"
import { useAuth } from "@/contexts/AuthContext"; // Corrected path based on previous steps

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password cannot be empty"), // Changed min to 1 as 6 might be too strict for login UX
  // rememberMe: z.boolean().optional(), // Optional: if you implement remember me
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const navigate = useNavigate(); // Removed: Navigation handled by auth context
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      // rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Call the login function from the context
    // It returns a boolean, but we don't need to manually navigate here anymore
    await login(data.email, data.password);
     // No need for: if (success) { navigate('/'); }
     // The login function in AuthContext handles navigation on success.
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <span className="text-2xl font-bold text-auction-purple">AuctionVerse</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/signup"
            className="font-medium text-auction-purple hover:text-auction-purple-dark"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* --- Email Field --- */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="you@example.com"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.email.message}</p>
              )}
            </div>

            {/* --- Password Field --- */}
            <div>
               <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </Label>
                    {/* Optional: Forgot Password Link */}
                    {/* <div className="text-sm">
                        <a href="#" className="font-medium text-auction-purple hover:text-auction-purple-dark">
                        Forgot your password?
                        </a>
                    </div> */}
               </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`block w-full pl-10 pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
                 <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                 >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600" role="alert">{errors.password.message}</p>
              )}
            </div>

            {/* Optional: Remember Me / Forgot Password Row */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember-me" {...register("rememberMe")} />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </Label>
              </div>
            </div> */}

            {/* --- Submit Button --- */}
            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-auction-purple hover:bg-auction-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-auction-purple-dark disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                    // Optional: Add a spinner
                  "Signing in..."
                ) : (
                  <>
                    Sign in <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* --- Demo Accounts Section (Optional) --- */}
          {/* Consider removing this if it's confusing now with real auth */}
          {/* <div className="mt-6">
             <div className="relative">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-300" />
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-gray-500">Demo accounts</span>
               </div>
             </div>
             <div className="mt-4 grid grid-cols-1 gap-3">
                Your demo account divs here...
             </div>
           </div> */}

        </div>
      </div>
    </div>
  );
};

export default Login;