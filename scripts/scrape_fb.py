import os
import sys
import json
import urllib.request
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'facebook_extracted_assets')
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGET_URL = "https://www.facebook.com/profile.php?id=100083410961417"

def scrape_facebook():
    print(f"Navigating to {TARGET_URL}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 900},
            locale="ar-LY"
        )
        page = context.new_page()

        try:
            response = page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=25000)
            page.wait_for_timeout(4000)
        except Exception as e:
            print(f"Error loading page: {e}")

        # Page title and meta tags
        title = page.title()
        print(f"Page Title: {title}")

        # Extract meta tags
        meta_tags = page.eval_on_selector_all("meta", """
            elements => elements.map(el => ({
                name: el.getAttribute('name') || el.getAttribute('property'),
                content: el.getAttribute('content')
            })).filter(m => m.name && m.content)
        """)

        # Extract text snippets
        body_text = page.inner_text("body")
        
        # Look for images on page
        images = page.eval_on_selector_all("img", """
            imgs => imgs.map(img => ({
                src: img.src,
                alt: img.alt || ''
            })).filter(i => i.src && (i.src.includes('fbcdn.net') || i.src.startsWith('https://')))
        """)

        data = {
            "title": title,
            "url": page.url,
            "meta_tags": meta_tags,
            "images_found_count": len(images),
            "images": images[:40],
            "text_sample": body_text[:3000]
        }

        # Save structured report
        report_path = os.path.join(OUTPUT_DIR, "facebook_scraped_data.json")
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Saved scraped data to {report_path}")

        # Download discovered images
        print(f"Found {len(images)} images. Attempting to download high-res images...")
        saved_count = 0
        req_headers = {'User-Agent': 'Mozilla/5.0'}
        for i, img in enumerate(images[:25]):
            src = img['src']
            # Filter out tiny tracking pixels or icons
            if 'data:image' in src or 'rsrc.php' in src or 'emoji.php' in src:
                continue
            ext = ".jpg" if "jpg" in src or "jpeg" in src else ".png"
            dest = os.path.join(OUTPUT_DIR, f"fb_img_{saved_count+1}{ext}")
            try:
                req = urllib.request.Request(src, headers=req_headers)
                with urllib.request.urlopen(req, timeout=10) as resp, open(dest, "wb") as out:
                    out.write(resp.read())
                saved_count += 1
                print(f"  ✓ Saved fb_img_{saved_count}{ext} ({os.path.getsize(dest):,} bytes) - {img['alt'][:40]}")
            except Exception as e:
                pass

        print(f"Successfully downloaded {saved_count} images into {OUTPUT_DIR}")
        context.close()
        browser.close()

if __name__ == "__main__":
    scrape_facebook()
