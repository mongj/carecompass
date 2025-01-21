import { SquareArrowOutUpRight } from "lucide-react";

export default function SGWBanner() {
  return (
    <section className="flex flex-col place-content-center place-items-center">
      <div className="flex place-content-center place-items-center">
        <span className="whitespace-pre-line text-center text-sm leading-tight text-gray-500">
          Powered by&nbsp;
        </span>
        <div className="flex cursor-pointer place-items-center text-sm text-gray-500 underline">
          <a
            href="https://supportgowhere.gov.sg"
            target="_blank"
            className="pr-1"
          >
            SupportGoWhere
          </a>
          <SquareArrowOutUpRight size={12} />
        </div>
      </div>
      <span className="whitespace-pre-line text-center text-sm leading-tight text-gray-500">
        a Singapore Government Agency Website
      </span>
    </section>
  );
}
