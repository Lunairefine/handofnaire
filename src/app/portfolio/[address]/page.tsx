import BannerProfile from "@/app/portfolio/components/banner-profile";
import AddressPortfolioSection from "@/app/portfolio/components/address-portfolio-section";

export default async function AddressPage({
  params,
}: {
  params: Promise<{ address: string }> | { address: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  
  return (
    <div className="w-full space-y-8">
      <div className="flex w-full flex-col">
        <BannerProfile address={resolvedParams.address} />
        <div className="w-full pt-6">
          <AddressPortfolioSection address={resolvedParams.address} />
        </div>
      </div>
    </div>
  );
}
