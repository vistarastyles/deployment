import { Link, Image, Icons } from "@/components/Shared";
export default function Logo() {
  return (
    <Link href="/">
      <Image src={Icons.Logo} alt="Logo" width={110} height={110} />
    </Link>
  );
}
