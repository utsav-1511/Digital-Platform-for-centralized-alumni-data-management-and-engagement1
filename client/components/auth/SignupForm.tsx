import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  collegeName: z.string().min(1, "College name is required"),
  department: z.string().min(1, "Department is required"),
  graduationYear: z.string().min(4, "Valid graduation year required"),
  degree: z.string().min(1, "Degree is required"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Valid mobile number required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  jobTitle: z.string().optional(),
  companyName: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const collegesList = [
  "College 1",
  "College 2",
  // Add more colleges
];

const degrees = ["B.Tech", "M.Tech", "MBA", "M.Sc", "BCA", "MCA"];

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Signup failed");
      }

      const responseData = await res.json();
      localStorage.setItem("token", responseData.token);
      // Redirect to dashboard
    } catch (error) {
      console.error(error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <Input {...register("fullName")} />
          {errors.fullName && (
            <span className="text-red-500 text-xs">{errors.fullName.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <Input type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && (
            <span className="text-red-500 text-xs">
              {errors.dateOfBirth.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            {...register("gender")}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-xs">{errors.gender.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">College Name</label>
          <select
            {...register("collegeName")}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            {collegesList.map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
          {errors.collegeName && (
            <span className="text-red-500 text-xs">
              {errors.collegeName.message}
            </span>
          )}
        </div>

        {/* Add remaining fields similarly */}
        
        <div className="col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">
              I accept the terms and conditions
            </span>
          </label>
          {errors.acceptTerms && (
            <span className="text-red-500 text-xs">
              {errors.acceptTerms.message}
            </span>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}