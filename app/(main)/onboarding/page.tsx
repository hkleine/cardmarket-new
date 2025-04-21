import { CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
  return <SuccessMessage />;
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
