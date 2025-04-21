"use client";

import { TabsContent } from "@radix-ui/react-tabs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function ProfileForm({ referralLink }: { referralLink: string }) {
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
                <Button asChild>
                  <Link href={referralLink}>Onboard</Link>
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </form>
  );
}
