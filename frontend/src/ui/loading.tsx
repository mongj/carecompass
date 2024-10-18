import { BarLoader } from "react-spinners";
import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col gap-4 place-items-center place-content-center h-full w-full">
      <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
      <BarLoader color="#1361F0" speedMultiplier={2} />
    </div>
  );
}