import urllib.request
import time
import sys

url = "https://malgaroshy-maker.github.io/dibaj/"
print(f"Waiting for GitHub Pages deployment at {url} ...")

for attempt in range(1, 25):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            if response.status == 200:
                print(f"[SUCCESS] Website is LIVE! (HTTP 200) on attempt {attempt}")
                sys.exit(0)
    except Exception as e:
        print(f"Attempt {attempt}: Not ready yet ({e}), retrying in 5s...")
        time.sleep(5)

print("[TIMEOUT] Deployment still in progress.")
sys.exit(1)
