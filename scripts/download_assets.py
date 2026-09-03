import os
import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'assets')
os.makedirs(ASSETS_DIR, exist_ok=True)

ASSETS = [
    {
        "filename": "logo_crest.png",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1Vh1EiPpYU2MVPLV-LWomePReYf6TR3LITP_pyRTAfIZr_FOrQhU4Nbs37xlK6J572OA7Ci-g9yvoLY9_7Uc77U7xRP1iNYDmKHooVfp6xvTlZgmb5auMTq8ZeT3nvtderl3jZaoG7ESNuKd2c_wYrKr2VSLy9n-b1kQZWr3IYFAVOxDQmCvDnSjp1p8-sORxYPygTmb2BjlscUtUVuQBtVtqlGxWMjsPjZpVcVYa0vFJ92yuL4ewtYoUc",
        "description": "NA Crest Emblem"
    },
    {
        "filename": "logo_title.png",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1XwMbtZP1cLDhS7om5bLSc9XmlRBxH5nPXLRQX5fPCaAWaNa3r0a463uw7h8MprFk3VVKV-p704ljxOdBvLZjsO0Hd12H8XzhD2WxS3Uc7i17_6rEPXUCkGMZRNKDhOb266oRG1WdFDAbX9UfHYdq-Kmkf9YgnDUcsERQX9uyWASI59vjcO9ysV4AhYO2zmunxqo9k2KIHvl5osDCY8eUhZEdNLd6Uy6RNV3Fwx1Stx7A99VNU9dHjNS34",
        "description": "ALDIBAJ CO. Typography Logo"
    },
    {
        "filename": "craftsman_artisan.jpg",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1WtZQQcFnOQAtY_V7r6Q5eFYTotJutL89wd22FrKVxoZkxPoPs0JGdxoghYm9J7zBch1cRDRLX4R_pLUmCSuOHYCfBqDJar87UepOxtrzHJERAR3phQ-mioRTErN4vcFMBHJtWpThjzuspE0hrAspC2eZQ3A6fJ38csfmA-lBLwjuqMqNsErLTYq-r5Y5TTJRLgULxp5HRVYrW-bnGb9QKmRoo2T5NwfSgOQqpvydKQ2tNj6KQnAfuRrS5p",
        "description": "Master Libyan Craftsman Workshop"
    },
    {
        "filename": "arabic_majlis_luxury.jpg",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1U_CifKQ8tiLU-SeWCWUqvdqOz2GKi6fd4CFO2Rh-Va2yH53DD2DwepLsFHCPA8aGolBK_7FhQoQEjhYbgJFnoonLuYPe7FLD1TNaOkGp2goiJI1YXVloLMWhkYOaCTWJeYeqpNhKCRblv9tFAXoriTt5MGbDAekCKos0sDYX4ACNKBMdIQzXZKilcGgEXpWEL2KTAkK_yRWFSIfBnFNTkOjOCSx-jiheq_UDPrO_2WCVoCWOI48iqBz--Y",
        "description": "Opulent Arabic Majlis Salon"
    },
    {
        "filename": "luxury_living_salon.jpg",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1VvRRZfYWYR9GlxET8ONIUgN-E9-JhorjFeGCyGeFBk4LRfAqnkB1OUvCbltqdc3LLpOc7-iQY3FmFEmc4gX_ME3iL2N8_N0XXe-lnChJxXUctAKqQvrlToYKL6KLZ84N1HtQJFMDPKSJLjO0eLyB3cQ4gy7EgNtzeZqPm6xcHTpjEhtTQbtAuUG18BEup04oQKJLiZ72KMWhoR1AfP3rFdGTUgh0lNVZB9nS1RLVKLJmzSICNQ7s8GLELa",
        "description": "Modern Luxury Living Salon"
    },
    {
        "filename": "grand_villa_curtains.jpg",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1X7zR1jegPUTogVpfOsaSofrhpXoL1oQGZ4Zf1p1NWTv5jIF8BxEpUZr5v4lzBChv5LEBfubUQ0PTAFT5ethXofZfej8cGHQENQ3WeBQBDfhfwhZ5PSsgd2H-Zkl9h7-efEeppwFv-OMU63K-s7iRn9k915PLqf9pBoDlcoSPF7vKF8PugFQAdcBz_-UnxJA8hHYkmJvunFRX1fH-JAfnYCiY1wwbq8trEjYNb1md0owbjYmI5jrzpK5-Q",
        "description": "Grand Villa Sheer and Velvet Drapes"
    },
    {
        "filename": "fabric_rolls_samples.jpg",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1XmP301v0T_yjA1Vq1KOW5BTKwBo--mi8UvqVDRnPuNkzcfwVUtIjVAZt2cDWbdXb3ckOwuBPm4ShIKyKzr7z1PomO374gwnjti8bfB385EjC9qp_0tASn2klpkgwDFa-S0oBUAq09gBj6PLAf02IK4Sr8Qcaaw862dD_TZLCUB-H42XP_pJ6nOV45yImJ4n848vB2izvuUbDwc_4xcGFzZlhjUehEmgJqkIDLnhHUcIhiCskz1r1PZd3zz",
        "description": "Four Luxury Fabric Rolls & Swatches"
    },
    {
        "filename": "brand_letterhead_sample.jpg",
        "url": "https://lh3.googleusercontent.com/aida/AEtjO1WWOQTEiDwk_L7DWzKIex9uVRjrDCVSgMK1-7PCzJkqL8yfxDgx28TWvQz39r9eAXu1Jr73ykOQPppfF5XP_03IoFgAD5yLhPjybYkPNA9mb0LE-X810diLdQ4bHtgZJCy-NobTKlEEzUTECS7cXXak-8K67BYiApSN5m3GtTh9yUihMfIMZZ9TTWq515eSNCAtoqELjrLaWkOdqsjsGrFUK1t02vnD7Ra93BDs8e_84njRbI_wXhjHzHDo9q0LmyEOc5G0LnNQPY0",
        "description": "Official Company Stationery Wave and Crest"
    }
]

headers = {'User-Agent': 'Mozilla/5.0'}

for item in ASSETS:
    dest_path = os.path.join(ASSETS_DIR, item['filename'])
    print(f"Downloading {item['filename']} ({item['description']})...")
    req = urllib.request.Request(item['url'], headers=headers)
    try:
        with urllib.request.urlopen(req) as resp, open(dest_path, 'wb') as f:
            f.write(resp.read())
        print(f"  ✓ Saved to {dest_path} ({os.path.getsize(dest_path):,} bytes)")
    except Exception as e:
        print(f"  ✗ Failed to download {item['filename']}: {e}")

print("\nAsset download complete.")
