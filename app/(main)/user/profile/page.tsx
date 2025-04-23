import { createStripeOnboardingLink } from "@/app/serverQueries";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const accountLink = await createStripeOnboardingLink();
  return <ProfileForm referralLink={accountLink.url} />;
}
