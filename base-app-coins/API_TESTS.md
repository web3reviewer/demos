## API curl commands

Note: ensure RPC_URL and ZORA_API_KEY are set in your environment (or .env) before running.

### Fetch ZORA creator coins

Last N blocks (example: 300)

```sh
curl "http://localhost:3000/api/fetch-zora-creator-coins?window=300" | jq
```

Specific block range

```sh
curl "http://localhost:3000/api/fetch-zora-creator-coins?from=35224906&to=35225105" | jq
```

### Profile lookup

By identifier (wallet/contract/handle)

```sh
curl "http://localhost:3000/api/profile?identifier=0xdb768C16A28C07dcF606b1DA415647E76118c312" | jq
```

### Explore endpoints (Coins SDK)

Top gainers

```sh
curl "http://localhost:3000/api/coins/top-gainers?first=10" | jq
```

Top 24h volume

```sh
curl "http://localhost:3000/api/coins/top-volume-24h?first=10" | jq
```

Most valuable

```sh
curl "http://localhost:3000/api/coins/most-valuable?first=10" | jq
```

New coins

```sh
curl "http://localhost:3000/api/coins/new?first=10" | jq
```

Last traded

```sh
curl "http://localhost:3000/api/coins/last-traded?first=10" | jq
```

Last traded unique

```sh
curl "http://localhost:3000/api/coins/last-traded-unique?first=10" | jq
```

Pagination with cursor (example for any explore endpoint)

```sh
curl "http://localhost:3000/api/coins/top-gainers?first=10&after=YOUR_CURSOR" | jq
```


