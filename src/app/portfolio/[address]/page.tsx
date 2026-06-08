import BannerProfile from "@/app/portfolio/components/banner-profile";
import AddressPortfolioSection from "@/app/portfolio/components/address-portfolio-section";

export default async function AddressPage({
  params,
}: {
  params: Promise<{ address: string }> | { address: string };
}) {
  // Handle both Next.js 14 and 15 parameter types
  const resolvedParams = await Promise.resolve(params);
  
  return (
    <div className="w-full space-y-8">
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold font-sans">Portfolio</h2>
        <p className="text-[var(--text-secondary)] text-sm font-sans">
          Track portfolio holdings, token transfers, and flow.
        </p>
      </div>
      <div className="flex w-full flex-col">
        <BannerProfile address={resolvedParams.address} />
        <div className="w-full pt-6">
          <AddressPortfolioSection address={resolvedParams.address} />
        </div>
      </div>
    </div>
  );
}
