"use client";

import type React from "react";

import { createPartnerReferral } from "@/app/actions";
import { TabsContent } from "@radix-ui/react-tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    street: "Main Street",
    number: "123",
    postalCode: "10001",
    city: "New York",
    country: "US",
    isVendor: false,
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {}
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVendorToggle = async () => {
    const { links } = await createPartnerReferral();
    console.log(links);
    router.push(links[1].href);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.firstName) newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 2)
      newErrors.firstName = "First name must be at least 2 characters";

    if (!formData.lastName) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 2)
      newErrors.lastName = "Last name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.street) newErrors.street = "Street is required";
    if (!formData.number) newErrors.number = "House number is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordChange = () => {
    const newErrors: Record<string, string> = {};

    if (isChangingPassword) {
      if (!passwordData.newPassword)
        newErrors.newPassword = "New password is required";
      else if (passwordData.newPassword.length < 8)
        newErrors.newPassword = "Password must be at least 8 characters";

      if (!passwordData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (passwordData.newPassword !== passwordData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isFormValid = validateForm();
    const isPasswordValid = !isChangingPassword || validatePasswordChange();

    if (isFormValid && isPasswordValid) {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        console.log("Profile updated:", formData);

        // If changing password, update it
        if (isChangingPassword && passwordData.newPassword) {
          console.log("Password changed to:", passwordData.newPassword);
          setIsChangingPassword(false);
          setPasswordData({
            newPassword: "",
            confirmPassword: "",
          });
        }

        setIsLoading(false);
        alert("Profile updated successfully");
      }, 1500);
    }
  };

  return (
    <form className="w-[800px]">
      <Card>
        <Tabs defaultValue="personal">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="personal">
              <div className="flex items-center justify-between space-y-2">
                <div className="space-y-0.5">
                  <Label htmlFor="vendor-toggle">Become a Vendor</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable this to sell products and services on our platform
                  </p>
                </div>
                <Button onClick={handleVendorToggle}>Onboard</Button>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </form>
  );

  {
    /* <Card className="md:col-span-2">
<CardHeader>
      <CardTitle>Profile</CardTitle>
    </CardHeader>
    <CardContent>
    <Tabs defaultValue="account" className="w-[400px]">
<TabsList className="grid w-full grid-cols-2">
  <TabsTrigger value="account">Account</TabsTrigger>
  <TabsTrigger value="password">Password</TabsTrigger>
</TabsList>
<TabsContent value="account">
    </CardContent>

</Card> */
  }
  /* <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-y-2">
              <div className="space-y-0.5">
                <Label htmlFor="vendor-toggle">Become a Vendor</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this to sell products and services on our platform
                </p>
              </div>
              <Switch
                id="vendor-toggle"
                checked={formData.isVendor}
                onCheckedChange={handleVendorToggle}
              />
            </div>

            {formData.isVendor && (
              <div className="mt-6 rounded-md bg-muted p-4">
                <h4 className="mb-2 font-medium">Vendor Information</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  As a vendor, you'll need to provide additional information
                  about your business. This will be visible to customers on your
                  profile.
                </p>
                <Button variant="outline" size="sm">
                  Complete Vendor Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isChangingPassword ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value="********"
                      disabled
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
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
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
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>Update your address information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
              {errors.street && (
                <p className="text-sm text-destructive">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">House Number</Label>
                <Input
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                />
                {errors.number && (
                  <p className="text-sm text-destructive">{errors.number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
                {errors.postalCode && (
                  <p className="text-sm text-destructive">
                    {errors.postalCode}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleSelectChange("country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
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
              {errors.country && (
                <p className="text-sm text-destructive">{errors.country}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving changes...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form> */
}
