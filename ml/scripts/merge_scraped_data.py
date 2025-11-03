import pandas as pd

def merge_datasets():
    synthetic = pd.read_csv("ml/data/chennai_accidents.csv")
    scraped = pd.read_csv("ml/data/scraped_accidents.csv")

    # Map scraped data roughly into similar columns
    scraped_subset = pd.DataFrame({
        "City": ["Chennai"] * len(scraped),
        "Location": scraped["Title"].apply(lambda x: " ".join(x.split()[:3])),
        "Date": scraped["Date"],
        "Time": ["Unknown"] * len(scraped),
        "Fatal": [1 if "killed" in str(x).lower() or "dies" in str(x).lower() else 0 for x in scraped["Snippet"]],
        "Serious": [1 if "injured" in str(x).lower() else 0 for x in scraped["Snippet"]],
        "Light Injury": [0] * len(scraped),
        "Weather": ["Unknown"] * len(scraped),
        "Vehicle Type": ["Unknown"] * len(scraped),
        "Source_Link": scraped["Link"]
    })

    merged = pd.concat([synthetic, scraped_subset], ignore_index=True)
    merged.to_csv("ml/data/combined_accidents.csv", index=False)
    print(f"Combined dataset saved → ml/data/combined_accidents.csv ({len(merged)} records)")

if __name__ == "__main__":
    merge_datasets()
