import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
