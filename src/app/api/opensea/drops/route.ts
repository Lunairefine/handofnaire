import { NextResponse } from 'next/server';

const OPENSEA_BASE = 'https://api.opensea.io/api/v2';

function buildHeaders(apiKey: string): HeadersInit {
  return {
    'x-api-key': apiKey,
    'accept': 'application/json'
  };
}

async function fetchCollectionDetails(slug: string, headers: HeadersInit) {
  const [collectionRes, statsRes] = await Promise.allSettled([
    fetch(`${OPENSEA_BASE}/collections/${slug}`, { headers, next: { revalidate: 120 } }),
    fetch(`${OPENSEA_BASE}/collections/${slug}/stats`, { headers, next: { revalidate: 120 } })
  ]);

  let collection = null;
  let stats = null;

  if (collectionRes.status === 'fulfilled' && collectionRes.value.ok) {
    collection = await collectionRes.value.json();
  }
  if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
    stats = await statsRes.value.json();
  }

  return { collection, stats };
}

export async function GET() {
  const apiKey = process.env.OPENSEA_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENSEA_API_KEY is not configured in environment variables' },
      { status: 500 }
    );
  }

  const headers = buildHeaders(apiKey);

  try {
    const dropsResponse = await fetch(`${OPENSEA_BASE}/drops?type=recently_minted&limit=50`, {
      headers,
      next: { revalidate: 60 }
    });

    if (!dropsResponse.ok) {
      const errorText = await dropsResponse.text();
      return NextResponse.json(
        { error: `OpenSea API responded with ${dropsResponse.status}: ${errorText}` },
        { status: dropsResponse.status }
      );
    }

    const dropsData = await dropsResponse.json();
    const rawDrops = dropsData.drops || [];

    const enrichedDrops = await Promise.all(
      rawDrops.map(async (drop: any) => {
        const slug = drop.collection_slug;
        const { collection, stats } = await fetchCollectionDetails(slug, headers);

        let mintPriceEth = '0';
        if (drop.active_stage?.price) {
          mintPriceEth = (parseFloat(drop.active_stage.price) / 1e18).toString();
        }

        return {
          id: slug,
          name: drop.collection_name,
          contractAddress: drop.contract_address,
          chain: drop.chain,
          dropType: drop.drop_type,
          isMinting: drop.is_minting,
          imageUrl: drop.image_url,
          openseaUrl: drop.opensea_url,
          mintPrice: mintPriceEth,
          stageType: drop.active_stage?.stage_type || null,
          stageLabel: drop.active_stage?.label || null,
          startTime: drop.active_stage?.start_time || null,
          endTime: drop.active_stage?.end_time || null,
          maxPerWallet: drop.active_stage?.max_per_wallet || null,
          nextStage: drop.next_stage,

          description: collection?.description || null,
          owner: collection?.owner || null,
          totalSupply: collection?.total_supply ?? null,
          category: collection?.category || null,
          twitterUsername: collection?.twitter_username || null,
          discordUrl: collection?.discord_url || null,
          projectUrl: collection?.project_url || null,
          bannerUrl: collection?.banner_image_url || null,

          floorPrice: stats?.total?.floor_price ?? null,
          floorPriceSymbol: stats?.total?.floor_price_symbol || 'ETH',
          totalVolume: stats?.total?.volume ?? null,
          totalSales: stats?.total?.sales ?? null,
          numOwners: stats?.total?.num_owners ?? null,
        };
      })
    );

    return NextResponse.json({ drops: enrichedDrops });
  } catch (error) {
    console.error('Failed to fetch from OpenSea:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drops from OpenSea' },
      { status: 500 }
    );
  }
}
