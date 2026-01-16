#!/bin/bash
TOKEN=$(cat /tmp/token_current.txt)
API="https://luxoria-backend-5ulmz4f5na-od.a.run.app"
BASE=1250

echo "Adding 30 days of data..."
for i in {30..1}; do
    D=$(date -v-${i}d +%Y-%m-%d 2>/dev/null || date -d "${i} days ago" +%Y-%m-%d)
    P=$(awk -v b=$BASE -v i=$i 'BEGIN {srand(); printf "%.2f", b * (0.98 + rand() * 0.04) + (30-i)*0.3}')
    curl -s -X POST "$API/api/admin/prices" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"date\":\"$D\",\"price_per_gram_mad\":$P}" > /dev/null
    echo "✓ $D: $P MAD/g"
done

TODAY=$(date +%Y-%m-%d)
curl -s -X POST "$API/api/admin/prices" -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d "{\"date\":\"$TODAY\",\"price_per_gram_mad\":1280.50}" > /dev/null
echo "✓ $TODAY: 1280.50 MAD/g (TODAY)"
echo "✅ Done! 31 entries added"



