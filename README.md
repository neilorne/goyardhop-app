# GoYardHop app

The customer web app for GoYardHop, on-demand yard care in Nashville. Goal: book a yard service in three taps.

1. Type your address and tap **Get my price**. The app looks up the lot size from Metro Nashville property records.
2. See one instant price (everything included, no estimates).
3. Tap **Book first available**, or pick another day and time.

## What's real and what isn't yet

- Real: lot sizes for about 217,000 Davidson County homes, and the pricing.
- Not yet: accounts, saving bookings, payments (Stripe), text messages (Twilio), the crew app and the owner dashboard. See [docs/ROADMAP.md](docs/ROADMAP.md).

## Changing prices

All prices live at the top of [lib/pricing.ts](lib/pricing.ts). Every price includes the $25 base fee.

## For developers

```
npm install
npm run dev     # http://localhost:3000
npm test
```

Next.js app. `data/parcels.json` is built by `python3 -I tools/build_parcels.py data/parcels.json` (needs access to maps.nashville.gov).
