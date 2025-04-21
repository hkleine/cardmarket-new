"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchantId");
  const merchantIdInPayPal = searchParams.get("merchantIdInPayPal");
  const permissionsGranted = searchParams.get("permissionsGranted");
  const consentStatus = searchParams.get("consentStatus");
  console.log(merchantId, merchantIdInPayPal);
  return (
    <div>
      {permissionsGranted && consentStatus ? <SuccessMessage /> : <div></div>}
    </div>
  );
}

function SuccessMessage() {
  return (
    <div className="grid grid-cols-2">
      <div className="p-8 col-span-2 rounded-md bg-success-100 text-success-800 flex items-center gap-4">
        <CheckCircle2 />
        You successfully onboarded as a Seller.
      </div>
    </div>
  );
}

function ErrorMessage() {
  return <div>Ooops something went wrong during the onboarding process.</div>;
}
