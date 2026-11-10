# Hand of Naire

Hand of Naire adalah dashboard toolkit Web3 berbasis Next.js untuk memantau aktivitas blockchain, memeriksa aset, dan menjalankan operasi multi-wallet.

## Tools

- **Portfolio** — melihat portfolio, saldo, token, dan riwayat aktivitas berdasarkan alamat.
- **Wallet Generator** — membuat wallet EVM dan vanity address.
- **Balance Checker** — memeriksa saldo banyak alamat.
- **Multisender** — mengirim native token ke banyak alamat dengan mode one-to-many, many-to-one, dan many-to-many.
- **RPC Scanner** — menguji endpoint RPC dan membandingkan latency/status jaringan.
- **ERC721 Mint Scanner** — memantau event mint NFT dari log `Transfer`, ERC1155, dan `ConsecutiveTransfer`.
- **ERC20 Mint Scanner** — memantau event `Transfer` dari zero address.

OpenSea tidak ditampilkan pada menu navigasi utama.

## Jaringan

Selector jaringan utama mendukung:

- Ethereum
- Base
- Optimism
- Arbitrum One
- Elysium Mainnet (`99901`)
- HyperEVM (`999`)
- BNB Smart Chain
- Robinhood Chain

Detail RPC, explorer, dan Blockscout dikelola di [`src/services/networkConfig.ts`](src/services/networkConfig.ts). URL RPC bukan secret dan tidak perlu disimpan di `.env`.

## Prasyarat

- Node.js 20 atau lebih baru
- npm

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Environment variables

Environment variable hanya diperlukan untuk konfigurasi yang bersifat rahasia atau deployment-specific. Buat file `.env.local` jika diperlukan:

```env
OPENSEA_API_KEY=your_opensea_api_key
```

RPC jaringan tidak dikonfigurasi melalui environment variable. Untuk mengganti endpoint RPC, edit `NETWORK_CONFIG` pada `src/services/networkConfig.ts`.

## Perintah yang tersedia

```bash
npm run dev      # menjalankan development server
npm run build    # membuat production build
npm run start    # menjalankan production server
npm run lint     # menjalankan ESLint
```

## Struktur penting

```text
src/app/                 halaman dan komponen Next.js
src/hooks/               scanner dan state logic
src/services/            konfigurasi jaringan, RPC, dan explorer
src/lib/                 chain clients dan utilitas transaksi
src/parser/              parser ABI dan fungsi mint
```

## Catatan keamanan

- Gunakan burner wallet untuk multisender.
- Jangan memasukkan private key ke repository atau membagikannya.
- Transaksi blockchain tidak dapat dibatalkan setelah dikirim.
