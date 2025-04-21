import { createPartnerReferral } from "@/app/serverQueries";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const { links } = await createPartnerReferral();

  return <ProfileForm referralLink={links[1].href} />;
}
