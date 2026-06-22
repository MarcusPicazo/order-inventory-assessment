#!/bin/bash

BASE_URL="http://localhost:3000/api"
API_KEY="sk_test_a1b2c3d4e5f6"

echo "========================================="
echo "  Order & Inventory Service Stress Test"
echo "========================================="
echo ""

echo "[1/6] Checking service health..."
HEALTH=$(curl -s "$BASE_URL/health")
echo "Health: $HEALTH"
echo ""

echo "[2/6] Authenticating with API key..."
AUTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "X-API-Key: $API_KEY" "$BASE_URL/inventory")
AUTH_BODY=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/inventory")
echo "Auth response code: $AUTH_CODE"
echo "Auth response body: $(echo "$AUTH_BODY" | head -c 200)"
echo ""

echo "[3/6] Fetching inventory..."
INVENTORY=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/inventory")
echo "Inventory response: $(echo "$INVENTORY" | head -c 500)"
echo ""

echo "[4/6] Running concurrent order test (50 simultaneous orders)..."
FIRST_PRODUCT_ID=$(echo "$INVENTORY" | grep -o '"productId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$FIRST_PRODUCT_ID" ]; then
  echo "WARNING: Could not extract product ID (auth may be failing)."
  echo "Attempting concurrent orders anyway with a placeholder..."
  echo "If all orders return auth errors, this confirms an authentication issue."
  echo ""
  FIRST_PRODUCT_ID="00000000-0000-0000-0000-000000000000"
fi

BEFORE_QTY=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/inventory/$FIRST_PRODUCT_ID")
echo "Inventory before: $BEFORE_QTY"
echo ""

ORDER_PAYLOAD="{\"items\":[{\"productId\":\"$FIRST_PRODUCT_ID\",\"quantity\":1}]}"

rm -f /tmp/order_code_*.txt 2>/dev/null

echo "Sending 50 concurrent orders..."
for i in $(seq 1 50); do
  (
    CODE=$(curl -s -o /dev/null -w "%{http_code}" \
      -X POST \
      -H "Content-Type: application/json" \
      -H "X-API-Key: $API_KEY" \
      -d "$ORDER_PAYLOAD" \
      "$BASE_URL/orders")
    echo "$CODE" > /tmp/order_code_$i.txt
  ) &
done
wait

SUCCESS_COUNT=0
CONFLICT_COUNT=0
AUTH_ERROR_COUNT=0
OTHER_ERROR_COUNT=0

for i in $(seq 1 50); do
  CODE=$(cat /tmp/order_code_$i.txt 2>/dev/null | tr -d '[:space:]')
  case "$CODE" in
    201) SUCCESS_COUNT=$((SUCCESS_COUNT + 1)) ;;
    409) CONFLICT_COUNT=$((CONFLICT_COUNT + 1)) ;;
    403) AUTH_ERROR_COUNT=$((AUTH_ERROR_COUNT + 1)) ;;
    *)   OTHER_ERROR_COUNT=$((OTHER_ERROR_COUNT + 1)) ;;
  esac
done

echo "Results:"
echo "  201 Created:          $SUCCESS_COUNT"
echo "  409 Stock rejected:   $CONFLICT_COUNT"
echo "  403 Auth errors:      $AUTH_ERROR_COUNT"
echo "  Other errors:         $OTHER_ERROR_COUNT"
echo ""

AFTER_QTY=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/inventory/$FIRST_PRODUCT_ID")
echo "Inventory after: $AFTER_QTY"
echo ""

echo "[5/6] Running daily reports..."
REPORT_11=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/reports/daily-summary?date=2026-03-11")
echo "Report for 2026-03-11: $REPORT_11"
echo ""

REPORT_12=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/reports/daily-summary?date=2026-03-12")
echo "Report for 2026-03-12: $REPORT_12"
echo ""

echo "[6/6] Testing Redis pub/sub resilience..."
echo "Creating an order, then restarting Redis, then creating another order..."

ORDER1_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" \
  -d "$ORDER_PAYLOAD" "$BASE_URL/orders")
ORDER1_BODY=$(curl -s -X POST -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" \
  -d "$ORDER_PAYLOAD" "$BASE_URL/orders")
echo "Order before Redis restart: [$ORDER1_CODE] $ORDER1_BODY"
echo ""

echo "Restarting Redis container..."
docker restart phase-1-debugging-redis-1 2>/dev/null || docker restart redis 2>/dev/null
sleep 3

ORDER2_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" \
  -d "$ORDER_PAYLOAD" "$BASE_URL/orders")
ORDER2_BODY=$(curl -s -X POST -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" \
  -d "$ORDER_PAYLOAD" "$BASE_URL/orders")
echo "Order after Redis restart: [$ORDER2_CODE] $ORDER2_BODY"
echo ""

FINAL_QTY=$(curl -s -H "X-API-Key: $API_KEY" "$BASE_URL/inventory/$FIRST_PRODUCT_ID")
echo "Final inventory state: $FINAL_QTY"
echo ""

echo "========================================="
echo "  Stress Test Complete"
echo "========================================="
echo ""
echo "Review the results above for inconsistencies."
echo ""
echo "Expected seed data orders for 2026-03-11 (Eastern Time):"
echo "  - Order 1: 2 x Wireless Keyboard @ 49.99 = 99.98 (11:15 PM ET)"
echo "  - Order 2: 1 x USB-C Hub @ 34.50 = 34.50 (11:45 PM ET)"
echo "  - Order 4: 1 x Mechanical Keyboard + 1 x Webcam = 189.99 (10:30 PM ET)"
echo "Expected total for 2026-03-11: 324.47"
echo ""
echo "Check:"
echo "  - Did authentication work with the provided API key?"
echo "  - Did the concurrent orders respect inventory limits?"
echo "  - Do the daily report totals match expectations?"
echo "  - Did inventory update correctly after Redis restart?"
echo "  - Are cached order calculations producing valid numbers?"
