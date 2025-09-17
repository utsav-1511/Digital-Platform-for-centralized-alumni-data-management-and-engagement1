import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or mobile number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [useOTP, setUseOTP] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      const endpoint = useOTP ? "/api/auth/login-otp" : "/api/auth/login";
      const body = useOTP ? { ...data, otp} : data;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Login failed");

      const responseData = await res.json();
      localStorage.setItem("token", responseData.token);
      // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  const sendOTP = async () => {
    // Implement OTP sending logic
    setOtpSent(true);
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">
          Email or Mobile Number
        </label>
        <Input {...register("identifier")} />
        {errors.identifier && (
          <span className="text-red-500 text-xs">
            {errors.identifier.message}
          </span>
        )}
      </div>

      {!useOTP ? (
        <div>
          <label className="block text-sm font-medium">Password</label>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium">OTP</label>
          <div className="flex gap-2">
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <Button
              type="button"
              variant="outline"
              onClick={sendOTP}
              disabled={otpSent}
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="h-4 w-4" />
          <span className="text-sm">Remember me</span>
        </label>
        <button
          type="button"
          onClick={() => setUseOTP(!useOTP)}
          className="text-sm text-primary"
        >
          {useOTP ? "Use Password" : "Use OTP"}
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <a href="#" className="block text-center text-sm text-primary">
        Forgot password?
      </a>
    </form>
  );
}