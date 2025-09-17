import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Alumni");
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        /* ignore json parse */
      }
      if (!res.ok) {
        const message =
          data?.error ||
          (data && data.message) ||
          `${res.status} ${res.statusText}`;
        console.error("Login failed", res.status, data);
        return alert(message || "Login failed");
      }
      // store token
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login error");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        /* ignore */
      }
      if (!res.ok) {
        const msg = data?.error || `${res.status} ${res.statusText}`;
        console.error("Signup failed", res.status, data);
        return alert(msg || "Signup failed");
      }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Signup error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-md text-center">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/60 text-white shadow-md">
                <GraduationCap className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Welcome to Alumni Hub
              </h2>
              <p className="text-sm text-muted-foreground">
                Connect with fellow alumni, find events, and stay engaged with
                your community.
              </p>
            </div>
          </div>

          {/* Right form */}
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
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <Input
                    placeholder="you@example.com"
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
                  <div className="relative">
                    <Input
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option>Alumni</option>
                    <option>Student</option>
                    <option>Admin</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="submit">Login</Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-2 border-accent text-accent"
                    onClick={handleSignup}
                  >
                    Sign Up
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Alumni Hub &nbsp;|&nbsp;{" "}
                <a href="#" className="text-primary">
                  Privacy Policy
                </a>{" "}
                &nbsp;|&nbsp;{" "}
                <a href="#" className="text-primary">
                  Terms
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
