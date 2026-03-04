import json
import re
import os
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# --- CONFIGURATION ---
RSS_FEEDS = ["https://gcaptain.com/feed/"]

def fetch_live_news():
    print("Fetching live maritime news feeds...")
    alerts = []
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    for url in RSS_FEEDS:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                
                for item in root.findall('.//item')[:5]:
                    title = item.find('title').text
                    link = item.find('link').text
                    alerts.append({
                        "id": f"news-{hash(title)}",
                        "msg": title,
                        "url": link,
                        "time": datetime.now().strftime("%H:%M")
                    })
        except Exception as e:
            print(f"Error fetching from {url}: {e}")
            
    return alerts

if __name__ == "__main__":
    data_dir = 'data'
    if not os.path.exists(data_dir): os.makedirs(data_dir)
    
    live_alerts = fetch_live_news()
    
    output = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "alerts": live_alerts
    }
    
    with open(os.path.join(data_dir, 'maritime_data.json'), 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"Sync Complete: {len(live_alerts)} alerts captured.")
