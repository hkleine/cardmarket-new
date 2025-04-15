"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { signUpAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { COUNTRIES } from "@/utils/countries";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

// List of countries with their codes

export const formSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    street: z.string().min(2, {
      message: "Street name is required.",
    }),
    number: z.string().min(1, {
      message: "House number is required.",
    }),
    postalCode: z.string().min(3, {
      message: "Postal code is required.",
    }),
    city: z.string().min(2, {
      message: "City is required.",
    }),
    country: z.string().min(1, {
      message: "Country is required.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const steps = [
  {
    id: "personal",
    name: "Personal Information",
  },
  {
    id: "address",
    name: "Address",
  },
  {
    id: "complete",
    name: "Complete",
  },
];

export function SignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      street: "",
      number: "",
      postalCode: "",
      city: "",
      country: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await signUpAction(values);
  }

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);

    // Validate the fields for the current step
    const stepValid = await form.trigger(fields as any);

    if (stepValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0:
        return [
          "firstName",
          "lastName",
          "email",
          "password",
          "confirmPassword",
        ];
      case 1:
        return ["street", "number", "postalCode", "city", "country"];
      default:
        return [];
    }
  };

  // Custom country select component with flags
  const CountrySelect = ({ field }: { field: any }) => (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {COUNTRIES.map((country) => (
          <SelectItem
            key={country.code}
            value={country.code}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 h-4 overflow-hidden rounded-sm">
                <img
                  src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                  width="20"
                  height="15"
                  alt={country.name}
                  className="h-full w-full object-cover"
                />
              </span>
              {country.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.slice(0, -1).map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {currentStep > index ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-xs mt-1">{step.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 w-full bg-muted">
            <div
              className="h-1 bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / (steps.length - 2)) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john.doe@example.com"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Password must be at least 8 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <CountrySelect field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 2 && (
              <div className="py-10 text-center space-y-4">
                {isSubmitted ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-medium">
                      Account Created Successfully!
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you for signing up. You can now access your account.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => router.push("/dashboard")}
                    >
                      Go to Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-medium">
                      Review Your Information
                    </h3>
                    <p className="text-muted-foreground">
                      Please review your information before submitting.
                    </p>
                    <div className="text-left mt-6 space-y-4 bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            First Name
                          </p>
                          <p>{form.getValues("firstName")}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Last Name
                          </p>
                          <p>{form.getValues("lastName")}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{form.getValues("email")}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>
                          {form.getValues("street")} {form.getValues("number")},{" "}
                          {form.getValues("postalCode")}{" "}
                          {form.getValues("city")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Country</p>
                        <p className="flex items-center gap-2">
                          {form.getValues("country") && (
                            <>
                              <span className="inline-block w-6 h-4 overflow-hidden rounded-sm">
                                <img
                                  src={`https://flagcdn.com/w20/${form.getValues("country").toLowerCase()}.png`}
                                  width="20"
                                  height="15"
                                  alt={
                                    COUNTRIES.find(
                                      (c) =>
                                        c.code === form.getValues("country")
                                    )?.name || ""
                                  }
                                  className="h-full w-full object-cover"
                                />
                              </span>
                              {
                                COUNTRIES.find(
                                  (c) => c.code === form.getValues("country")
                                )?.name
                              }
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > 0 && currentStep < 2 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}

              {currentStep === 0 && (
                <Button type="button" className="ml-auto" onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {currentStep === 1 && (
                <Button type="button" className="ml-auto" onClick={nextStep}>
                  Review <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}

              {currentStep === 2 && !isSubmitted && (
                <div className="flex w-full space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button asChild variant="link" className="p-0 h-auto font-semibold">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
