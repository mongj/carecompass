import { LinkIcon } from "lucide-react";

export default function ExternalLink(props: { link: string, text: string }) {
  return (
    <div className="flex gap-2 place-items-center">
      <LinkIcon className="text-brand-primary-500" size={16} />
      <a href={props.link} target="_blank" className="text-brand-primary-500 underline">{props.text}</a>
    </div>
  );
}