import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random

def scrape_chennai_accidents():
    base_url = "https://timesofindia.indiatimes.com/topic/road-accident-in-chennai"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
    }

    data = []
    print("🔍 Scraping accident news from Times of India...")

    for page in range(1, 4):  # scrape first 3 pages
        url = f"{base_url}?from=mdr&page={page}"
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"⚠️ Skipping page {page}, status code {response.status_code}")
            continue

        soup = BeautifulSoup(response.text, "html.parser")

        # Articles are inside <div class='uwU81'> blocks
        articles = soup.select("div.uwU81")
        if not articles:
            # Fallback for other TOI topic layouts
            articles = soup.select("div.content")

        for art in articles:
            title_tag = art.select_one("span.w_tle a") or art.select_one("a")
            date_tag = art.select_one("span.strlastupd") or art.select_one("span.meta")
            desc_tag = art.select_one("div.w_desc") or art.select_one("div.cmsdesc")

            title = title_tag.text.strip() if title_tag else ""
            link = f"https://timesofindia.indiatimes.com{title_tag['href']}" if title_tag else ""
            date = date_tag.text.strip() if date_tag else "Unknown"
            snippet = desc_tag.text.strip() if desc_tag else ""

            # filter only Chennai-related articles
            if "chennai" in title.lower() or "chennai" in snippet.lower():
                data.append([title, date, link, snippet])

        time.sleep(random.uniform(1, 2))  # polite delay

    df = pd.DataFrame(data, columns=["Title", "Date", "Link", "Snippet"])

    save_path = "ml/data/scraped_accidents.csv"
    df.to_csv(save_path, index=False)

    print(f"Saved scraped data → {save_path} ({len(df)} records)")
    return df


if __name__ == "__main__":
    scrape_chennai_accidents()
