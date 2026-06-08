"use client";

import { useAppContext } from "@/app/components/AppContext";

type BannerProfileDetailsProps = {
  address: string;
  headingLabel: string;
  ensAvatar: string | null;
  ensAvatarFallback: string | null;
  addressType: "EOA" | "CONTRACT";
  isVerified: boolean;
  copied: boolean;
  isLoading: boolean;
  onCopy: () => void;
};

export default function BannerProfileDetails({
  address,
  headingLabel,
  ensAvatar,
  ensAvatarFallback,
  addressType,
  isVerified,
  copied,
  isLoading,
  onCopy,
}: BannerProfileDetailsProps) {
  const { theme } = useAppContext();
  
  let avatarSrc = ensAvatar || ensAvatarFallback;
  if (!avatarSrc && address) {
    const cleanAddress = address.toLowerCase();
    const charSum = cleanAddress.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const imageIndex = (charSum % 4) + 1;
    const bgPrefix = theme === 'light' ? 'syntaxbgblack' : 'syntaxbgwhite';
    avatarSrc = `/media/syntax/${bgPrefix}${imageIndex}.png`;
  }
  const avatarFallbackLabel = headingLabel.replace(/^0x/i, "").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-6">
      <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden bg-foreground/5 shadow-sm rounded-full">
        {avatarSrc ? (
          <div className="relative h-full w-full">
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 text-2xl font-semibold text-foreground">
              {avatarFallbackLabel || "?"}
            </div>
            <img
              key={avatarSrc}
              src={avatarSrc}
              alt="ENS Avatar"
              className="relative h-full w-full object-cover"
              onError={(event) => {
                const image = event.currentTarget;

                if (
                  ensAvatar &&
                  ensAvatarFallback &&
                  image.src !== ensAvatarFallback &&
                  image.dataset.fallbackApplied !== "true"
                ) {
                  image.dataset.fallbackApplied = "true";
                  image.src = ensAvatarFallback;
                  return;
                }

                if (address && image.dataset.syntaxFallbackApplied !== "true") {
                  image.dataset.syntaxFallbackApplied = "true";
                  const cleanAddress = address.toLowerCase();
                  const charSum = cleanAddress.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
                  const imageIndex = (charSum % 4) + 1;
                  const bgPrefix = theme === 'light' ? 'syntaxbgblack' : 'syntaxbgwhite';
                  image.src = `/media/syntax/${bgPrefix}${imageIndex}.png`;
                  return;
                }

                image.style.opacity = "0";
              }}
            />
          </div>
        ) : isLoading ? (
          <div className="h-full w-full animate-pulse bg-foreground/10" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-foreground/10 text-2xl font-semibold text-foreground">
            {avatarFallbackLabel || "?"}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {headingLabel}
        </h2>

        <div className="flex flex-col gap-1">
          <button
            onClick={onCopy}
            className="group flex w-max items-center gap-2 px-0 py-1 text-sm font-medium text-zinc-500 transition-colors hover:text-foreground"
            title="Copy address"
          >
            <span>{address}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={copied ? "text-teal-400" : "text-zinc-500 group-hover:text-zinc-300"}
            >
              {copied ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </>
              )}
            </svg>
          </button>

          <div className="flex items-center gap-1.5 px-0 py-0.5">
            {addressType === "CONTRACT" && isVerified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {addressType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
