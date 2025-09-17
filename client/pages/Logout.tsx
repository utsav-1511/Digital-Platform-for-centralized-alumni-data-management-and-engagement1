import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export default function Logout() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-800">
          You have successfully logged out.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for visiting Alumni Hub. See you again soon!
        </p>
        <div className="mt-6">
          <Button onClick={() => navigate("/")}>Login Again</Button>
        </div>
      </div>
    </div>
  );
}
