import { useState } from "react";
import AIChatbot from "@/components/ai/AIChatbot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Alumni");
  const [enrollmentNumber, setEnrollmentnumber] = useState("");
  const [college, setCollege] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  const handleSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error || "Signup failed");
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Signup error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col items-start justify-center gap-6 pl-6">
          <h1 className="text-4xl font-bold text-primary">Alumni Hub</h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Connect with alumni, discover events, collaborate on mentorship and
            job opportunities. Sign up to get started.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Alumni directory</li>
            <li>• Events & RSVPs</li>
            <li>• Forum & real-time chat</li>
            <li>• AI assistant for quick help</li>
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-6 shadow-lg">
            <div className="mb-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-white font-bold">
                  A
                </div>
                <h3 className="text-lg font-semibold">Alumni Hub</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to your account"
                  : "Create a new account"}
              </p>
            </div>

            {/* Update the login/signup toggle buttons */}
            <div className="flex gap-2 mb-4 items-center justify-center">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-md px-3 py-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 ${
                  mode === "login"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border hover:border-primary hover:text-primary"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-md px-3 py-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95 ${
                  mode === "signup"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border hover:border-primary hover:text-primary"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form
              onSubmit={
                mode === "login"
                  ? handleLogin
                  : (e) => {
                      e.preventDefault();
                      handleSignup();
                    }
              }
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <Input
                  placeholder="text@hotmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Input
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>

              {mode === "signup" && (
                
                <div>
                <div>
                <label className="block text-sm font-medium text-slate-700">
                  Enrollment Number
                </label>
                <Input
                  placeholder="Enrollment Number"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentnumber(e.target.value)}
                  type="number"
                  required
                />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Select College
                  </label>
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option selected>Select College</option>
                    <option>XYZ University</option>
                    <option>Punjab University</option>
                    <option>ABU University</option>
                    <option>NIT Punjab</option>
                  </select>
                </div>
                
                  <label className="block text-sm font-medium text-slate-700">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Super Admin</option>
                    <option>Alumni</option>
                    <option>Student</option>
                    <option>Admin</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" />{" "}
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary">
                  Forgot password?
                </a>
              </div>

              {/* Update the main submit button and skip login button */}
              <div className="flex flex-col gap-2 items-center ">
                <Button 
                  type="submit"
                  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary/90"
                >
                  {mode === "login" ? "Login" : "Sign Up"}
                </Button>

                <Button
                  variant="ghost"
                  className="transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary/50"
                  onClick={() => {
                    localStorage.setItem("DEV_BYPASS_AUTH", "true");
                    navigate("/dashboard");
                  }}
                >
                  Continue to Dashboard (skip login)
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} Alumni Hub
            </div>
          </Card>
        </div>
      </div>

      <AIChatbot />
    </div>
  );
}
