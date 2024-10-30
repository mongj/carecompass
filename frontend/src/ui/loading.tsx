import { BarLoader } from "react-spinners";
import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="flex h-full w-full flex-col place-content-center place-items-center gap-8">
      <Image src="/img/logo.svg" alt="Logo" width={64} height={64} />
      <BarLoader color="#1361F0" speedMultiplier={2} />
    </div>
  );
}
