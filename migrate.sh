# For reference: https://plu.sh/mgrt

function redis_target() {
  redis-cli -u redis://default:$REDIS_PASSWORD@$REDIS_HOST:$REDIS_PORT $@
}

redis-cli -h localhost -p 6379 -n 0 keys \* | while read key; do
 if [ $key = "saved_voice_channels" ] || [ $key = "voice_channel_members" ]; then
  printf "Moving $key..."
  redis-cli -h localhost -p 6379 --raw DUMP $key | head -c-1 | redis_target -x RESTORE $key 0
 fi
done
