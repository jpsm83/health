import { Metadata } from "next";
import { generatePrivateMetadata } from "@/lib/utils/genericMetadata";
import Profile from "@/pagesClient/Profile";
import ErrorBoundary from "@/components/ErrorBoundary";
import { getUserById } from "@/app/actions/user/getUserById";
import { auth } from "@/app/api/v1/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generatePrivateMetadata(locale, "/profile", "metadata.profile.title");
}

// Server Component - handles metadata generation and data fetching
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Get session on server
  const session = await auth();
  
  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect(`/${locale}/signin`);
  }

  // Fetch user data on server
  const userResult = await getUserById(session.user.id);
  
  if (!userResult.success || !userResult.data) {
    // Handle error - could redirect or show error page
    redirect(`/${locale}/signin`);
  }

  // Handle array response from getUserById
  const userData = Array.isArray(userResult.data) ? userResult.data[0] : userResult.data;

  return (
    <main className="container mx-auto">
      <ErrorBoundary context={"Profile component"}>
        <Profile initialUser={userData} />
      </ErrorBoundary>
    </main>
  );
}
