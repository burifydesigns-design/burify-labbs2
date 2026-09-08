"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { Checkbox } from "./Checkbox";

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  agreeTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
  agreeTerms?: string;
}

const serviceOptions = [
  { value: "web-design", label: "Web Design & Development" },
  { value: "ai-automation", label: "AI Automation" },
  { value: "brand-identity", label: "Brand Identity" },
  { value: "ecommerce", label: "E-Commerce Solutions" },
  { value: "mobile-app", label: "Mobile App Development" },
  { value: "other", label: "Other" },
];

const budgetOptions = [
  { value: "", label: "Select your budget range" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-50k", label: "$25,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k+", label: "$100,000+" },
];

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    budget: "",
    message: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Please provide more details about your project";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitStatus("idle");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        company: "",
        service: "",
        budget: "",
        message: "",
        agreeTerms: false,
      });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="bg-background border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-h3 text-text-primary mb-2">Message Sent</h3>
        <p className="text-body text-primary-dark/80 mb-6">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <Button onClick={() => setSubmitStatus("idle")}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Your name"
          required
          autoComplete="name"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@company.com"
          required
          autoComplete="email"
        />
      </div>

      <Input
        label="Company"
        name="company"
        type="text"
        value={formData.company}
        onChange={handleChange}
        placeholder="Your company name (optional)"
        autoComplete="organization"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          error={errors.service}
          options={serviceOptions}
          placeholder="Select a service"
          required
        />
        <Select
          label="Budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          options={budgetOptions}
          placeholder="Select budget range"
        />
      </div>

      <Textarea
        label="Project Details"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        placeholder="Tell us about your project, goals, and timeline..."
        required
        rows={5}
      />

      <Checkbox
        label="I agree to the terms of service and privacy policy"
        name="agreeTerms"
        checked={formData.agreeTerms}
        onChange={handleChange}
        error={errors.agreeTerms}
        required
      />

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-body-sm" role="alert">
          Something went wrong. Please try again or email us directly.
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        isLoading={isSubmitting}
      >
        Start a Project
      </Button>
    </form>
  );
}

export default ContactForm;
