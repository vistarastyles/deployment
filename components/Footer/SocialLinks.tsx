import { socialLinks, Link } from "../Shared";

export default function SocialLinks() {
  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => {
        const IconComponent = social.icon;
        return (
          <Link
            key={social.name}
            href={social.href}
            className={`p-2 rounded-full bg-gray-800 text-gray-400 transition-colors duration-200 ${social.color} hover:bg-gray-700`}
            aria-label={social.name}
          >
            <IconComponent className="h-5 w-5" />
          </Link>
        );
      })}
    </div>
  );
}
