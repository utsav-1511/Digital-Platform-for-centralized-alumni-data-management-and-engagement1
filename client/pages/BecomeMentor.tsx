import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMentorApplication } from "@/services/mentor";
import type { MentorApplication, MentorAvailableFor, MentorExpertise, MentorIndustry, MentorMode } from "@shared/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const industries: MentorIndustry[] = ["IT", "Finance", "Healthcare", "Education", "Other"];
const expertiseOptions: MentorExpertise[] = [
  "Software Development",
  "Data Science & Analytics",
  "Project Management",
  "Business Analysis",
  "Career Guidance",
  "Startup & Entrepreneurship",
  "Networking Skills",
  "Resume Building",
  "Interview Preparation",
  "Other",
];
const availableForOptions: MentorAvailableFor[] = [
  "Career Advice",
  "Skill Development",
  "Interview Preparation",
  "Resume Review",
  "Networking Support",
  "Technical Guidance",
];

const schema = z.object({
  basic: z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    linkedin: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  }),
  professional: z.object({
    jobTitle: z.string().min(2, "Job title is required"),
    company: z.string().min(1, "Company is required"),
    industry: z.enum(["IT", "Finance", "Healthcare", "Education", "Other"], { required_error: "Industry is required" }),
    yearsOfExperience: z.coerce.number().int().min(0).max(60),
  }),
  expertise: z.object({
    areas: z.array(z.string()).min(1, "Select at least one area"),
    otherText: z.string().optional(),
  }),
  preferences: z.object({
    availableFor: z.array(z.string()).min(1, "Select at least one"),
    mode: z.enum(["online", "in_person", "both"], { required_error: "Select a mode" }),
    timeSlots: z.string().optional(),
  }),
  about: z.string().optional(),
  acceptedTerms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

type FormValues = z.infer<typeof schema>;

export default function BecomeMentor() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      preferences: { mode: "online" },
      acceptedTerms: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const payload: Omit<MentorApplication, "id" | "createdAt"> = {
        basic: values.basic,
        professional: {
          ...values.professional,
          industry: values.professional.industry as MentorIndustry,
        },
        expertise: {
          areas: values.expertise.areas as MentorExpertise[],
          otherText: values.expertise.otherText,
        },
        preferences: {
          availableFor: values.preferences.availableFor as MentorAvailableFor[],
          mode: values.preferences.mode as MentorMode,
          timeSlots: values.preferences.timeSlots,
        },
        about: values.about,
        acceptedTerms: values.acceptedTerms,
      };
      const res = await createMentorApplication(payload);
      toast.success("Application submitted", { description: `Reference ID: ${res.id}` });
      navigate("/mentor/dashboard");
    } catch (e: any) {
      toast.error("Submission failed", { description: e?.message ?? "Please try again" });
    } finally {
      setSubmitting(false);
    }
  };

  const areas = watch("expertise.areas") || [];
  const availableFor = watch("preferences.availableFor") || [];

  const toggleArray = (name: keyof FormValues["expertise"] | keyof FormValues["preferences"], value: string) => {
    const current: string[] = (watch(name as any) as any) || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    setValue(name as any, next as any, { shouldValidate: true });
  };

  return (
    <main className="container py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Become a Mentor</h1>
          <p className="text-muted-foreground mt-1">Share your expertise and help students and alumni grow in their careers.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Full Name</Label>
                <Input {...register("basic.fullName")} placeholder="Jane Doe" />
                {errors.basic?.fullName && <p className="text-red-600 text-xs mt-1">{errors.basic.fullName.message}</p>}
              </div>
              <div>
                <Label>Email Address</Label>
                <Input type="email" {...register("basic.email")} placeholder="jane@example.com" />
                {errors.basic?.email && <p className="text-red-600 text-xs mt-1">{errors.basic.email.message}</p>}
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input {...register("basic.phone")} placeholder="Optional" />
              </div>
              <div>
                <Label>LinkedIn Profile URL</Label>
                <Input {...register("basic.linkedin")} placeholder="https://linkedin.com/in/username" />
                {errors.basic?.linkedin && <p className="text-red-600 text-xs mt-1">{errors.basic.linkedin.message as string}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Current Job Title</Label>
                <Input {...register("professional.jobTitle")} placeholder="Senior Engineer" />
                {errors.professional?.jobTitle && <p className="text-red-600 text-xs mt-1">{errors.professional.jobTitle.message}</p>}
              </div>
              <div>
                <Label>Current Company</Label>
                <Input {...register("professional.company")} placeholder="Acme Corp" />
                {errors.professional?.company && <p className="text-red-600 text-xs mt-1">{errors.professional.company.message}</p>}
              </div>
              <div>
                <Label>Industry</Label>
                <Select onValueChange={(v) => setValue("professional.industry", v as any, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((i) => (
                      <SelectItem key={i} value={i}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.professional?.industry && <p className="text-red-600 text-xs mt-1">{errors.professional.industry.message}</p>}
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input type="number" min={0} max={60} {...register("professional.yearsOfExperience", { valueAsNumber: true })} placeholder="e.g., 5" />
                {errors.professional?.yearsOfExperience && <p className="text-red-600 text-xs mt-1">{errors.professional.yearsOfExperience.message as string}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {expertiseOptions.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <Checkbox checked={areas.includes(opt)} onCheckedChange={() => toggleArray("expertise.areas", opt)} />
                    {opt}
                  </label>
                ))}
              </div>
              {areas.includes("Other") && (
                <div className="mt-3">
                  <Label>Specify other expertise</Label>
                  <Input {...register("expertise.otherText")} placeholder="Your expertise" />
                </div>
              )}
              {errors.expertise?.areas && <p className="text-red-600 text-xs mt-2">{errors.expertise.areas.message as string}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentoring Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Available for</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {availableForOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={availableFor.includes(opt)} onCheckedChange={() => toggleArray("preferences.availableFor", opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
                {errors.preferences?.availableFor && (
                  <p className="text-red-600 text-xs mt-2">{errors.preferences.availableFor.message as string}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Preferred Mode of Mentoring</p>
                <RadioGroup defaultValue="online" onValueChange={(v) => setValue("preferences.mode", v as any, { shouldValidate: true })}>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="online" /> Online (Video Call, Chat)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="in_person" /> In-person (Local Area)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <RadioGroupItem value="both" /> Both
                  </label>
                </RadioGroup>
                {errors.preferences?.mode && <p className="text-red-600 text-xs mt-1">{errors.preferences.mode.message}</p>}
              </div>

              <div>
                <Label>Available Time Slots (optional)</Label>
                <Input {...register("preferences.timeSlots")} placeholder="e.g., Weekdays 6–8 PM IST" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brief About Yourself</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea {...register("about")} placeholder="Share your bio or motivation to mentor" className="min-h-32" />
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Controller
              name="acceptedTerms"
              control={control}
              render={({ field }) => (
                <Checkbox id="terms" checked={!!field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
              )}
            />
            <Label htmlFor="terms" className="text-sm">I agree to the terms and conditions</Label>
            <a href="#" className="text-sm text-primary underline ml-2">Privacy policy</a>
          </div>
          {errors.acceptedTerms && <p className="text-red-600 text-xs -mt-1">{errors.acceptedTerms.message as string}</p>}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Become a Mentor"}</Button>
          </div>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Coming soon: Mentor Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            View your mentees and chat with them via a simple in-app chat. We’ll add matching and messaging here.
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
