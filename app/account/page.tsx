import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Sign in to view this page</div>;
  }
  const User = await currentUser();

  if (!User) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <div className="w-screen min-h-screen text-white">
      Welcome, {User.firstName}!
      <SignOutButton />
    </div>
  );
}
