import Image from "next/image";
import Link from "next/link";

type PublicBrandProps = {
  variant?: "symbol" | "wordmark";
  className?: string;
};

export function PublicBrand({ variant = "symbol", className = "" }: PublicBrandProps) {
  if (variant === "wordmark") {
    return (
      <Link
        href="/"
        className={`inline-flex items-center ${className}`}
        aria-label="Instituto Incentive"
      >
        <Image
          src="/images/brand/instituto-incentive-logo.png"
          alt="Instituto Incentive"
          width={248}
          height={80}
          priority
          className="h-10 w-auto sm:h-11"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 text-sm font-semibold text-[var(--brand-text)] ${className}`}
      aria-label="Instituto Incentive"
    >
      <Image
        src="/images/brand/instituto-incentive-symbol.png"
        alt=""
        width={44}
        height={44}
        className="h-10 w-10 rounded-full object-contain"
      />
      <span className="hidden min-[420px]:inline">Instituto Incentive</span>
    </Link>
  );
}
