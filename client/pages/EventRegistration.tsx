import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { eventsData } from "@/data/events";
import { useToast } from "@/components/ui/use-toast";
import { Lock } from "lucide-react";

export default function EventRegistration() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const event = eventsData.find(e => e.id === eventId);
  
  // Form state with profile auto-fill
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    batch: "",
    college: "",
    company: "",
    dietaryRestrictions: "",
    attendance: "in-person",
    agreeToTerms: false,
    education: {
      college: "IIT Delhi", // These will come from user profile
      batch: "2027",
      degree: "B.Tech"
    }
  });

  // Auto-fill from profile
  useEffect(() => {
    // Simulated profile data fetch
    const profile = {
      name: "Utsav Kushwaha",
      email: "utsav@gmail.com",
      phone: "+91 9821272145",
      batch: "2027",
      college: "IIT Delhi",
      company: "Tech Corp"
    };

    setForm(prev => ({
      ...prev,
      ...profile
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.agreeToTerms) {
      toast({
        title: "Please agree to terms",
        description: "You must agree to the terms and conditions to register",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Registration Successful!",
        description: "You have been registered for the event.",
      });
      
      navigate("/events");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (!event) {
    return <div>Event not found</div>;
  }

  // Add this component to show locked fields
  function LockedField({ label, value }: { label: string; value: string }) {
    return (
      <div className="relative">
        <Label>{label}</Label>
        <div className="mt-1 flex items-center">
          <Input
            value={value}
            disabled
            className="bg-muted pr-8"
          />
          <Lock className="absolute right-2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Register for {event.title}</h1>
          <p className="text-sm text-muted-foreground">
            {event.date} • {event.location}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Education Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education Details</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={form.education.college}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="batch">Batch</Label>
                  <Input
                    id="batch"
                    value={form.education.batch}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={form.education.degree}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Event Specific Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Event Details</h3>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="attendance">Mode of Attendance</Label>
                  <select
                    id="attendance"
                    value={form.attendance}
                    onChange={e => setForm(prev => ({ ...prev, attendance: e.target.value }))}
                    className="w-full bg-muted"
                  >
                    <option value="in-person">In-Person</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                  <Input
                    id="dietaryRestrictions"
                    placeholder="Any dietary restrictions? (Optional)"
                    value={form.dietaryRestrictions}
                    onChange={e => setForm(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={form.agreeToTerms}
                onCheckedChange={(checked) => 
                  setForm(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms and conditions
              </Label>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/events")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Register for Event
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}