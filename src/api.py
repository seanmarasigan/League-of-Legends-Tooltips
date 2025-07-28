# loltips_api.py
import asyncio
import urllib.request
import json
import ssl

API_URL = "https://127.0.0.1:2999/liveclientdata/allgamedata"

def get_status():
    with urllib.request.urlopen(API_URL, context=ssl._create_unverified_context()) as response:
        return json.loads(response.read())

async def monitor_status():
    while True:
        try:
            data = await asyncio.to_thread(get_status)
            print(json.dumps(data), flush=True)  # <- critical for Node.js
            await asyncio.sleep(0.1)
        except Exception as e:
            print(json.dumps({"error": str(e)}), flush=True)
            await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(monitor_status())
