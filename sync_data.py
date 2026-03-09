import json
import re
import os
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# --- CONFIGURATION ---
RSS_FEEDS = [
    "https://gcaptain.com/feed/",
    "https://www.shippingazette.com/rss/news.xml",
    "https://www.joc.com/feed/news"
]

# Define Risk Keywords and their Impact
RISK_RULES = [
    {"keywords": ["Suez", "Red Sea", "Houthi"], "id": "suez_disruption", "label": "Suez/Red Sea Rerouting", "delay": 12, "cost": 1500},
    {"keywords": ["Hormuz", "Iran", "Strait"], "id": "hormuz_disruption", "label": "Strait of Hormuz Alert", "delay": 5, "cost": 800},
    {"keywords": ["Panama", "Drought", "Water"], "id": "panama_disruption", "label": "Panama Canal Slot Restriction", "delay": 4, "cost": 500},
    {"keywords": ["Strike", "Labor", "Union"], "id": "port_strike", "label": "Port Labor Strike", "delay": 3, "cost": 300},
    {"keywords": ["Blizzard", "Storm", "Hurricane", "Typhoon"], "id": "weather_severe", "label": "Extreme Weather Impact", "delay": 2, "cost": 200}
]

def fetch_and_analyze_risks():
    print("Fetching and analyzing live maritime risks...")
    alerts = []
    active_risks = {} # Use dict to avoid duplicates
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    new_feed_items = []
    
    for url in RSS_FEEDS:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as response:
                root = ET.fromstring(response.read())
                
                for item in root.findall('.//item')[:15]:
                    title = item.find('title').text
                    link = item.find('link').text
                    description = item.find('description').text if item.find('description') is not None else ""
                    # Clean description from HTML tags
                    description = re.sub('<[^<]+?>', '', description)[:200] + "..." if description else ""
                    
                    # Analyze for specific risks
                    for rule in RISK_RULES:
                        if any(kw.lower() in title.lower() for kw in rule['keywords']):
                            risk_id = rule['id']
                            if risk_id not in active_risks:
                                active_risks[risk_id] = {
                                    "label": rule['label'],
                                    "delay": rule['delay'],
                                    "cost": rule['cost'],
                                    "source_news": title
                                }
                            
                    # General alerts
                    alerts.append({
                        "msg": title,
                        "url": link,
                        "time": datetime.now().strftime("%H:%M")
                    })
                    
                    # Prepare for news.json
                    category = "Liner News"
                    if any(kw in title.lower() for kw in ["port", "terminal", "berth"]): category = "Port Status"
                    if any(kw in title.lower() for kw in ["ai", "tech", "digital", "data"]): category = "Logistics Technology"
                    
                    new_feed_items.append({
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "time": datetime.now().strftime("%H:%M"),
                        "category": category,
                        "title": title,
                        "content": description if description else title,
                        "author": "Global Intelligence Bot",
                        "tags": [category.split()[0], "GlobalFeed"]
                    })
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            
    return alerts, list(active_risks.values()), new_feed_items

if __name__ == "__main__":
    data_dir = 'data'
    if not os.path.exists(data_dir): os.makedirs(data_dir)
    
    alerts, analyzed_risks, new_feed_items = fetch_and_analyze_risks()
    
    # Update maritime_data.json
    output = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "active_risks": analyzed_risks,
        "alerts": alerts
    }
    
    with open(os.path.join(data_dir, 'maritime_data.json'), 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Update news.json (Cumulative)
    news_file = os.path.join(data_dir, 'news.json')
    existing_news = []
    if os.path.exists(news_file):
        with open(news_file, 'r', encoding='utf-8') as f:
            try: existing_news = json.load(f)
            except: existing_news = []

    # Filter out duplicates by title
    existing_titles = set(item['title'] for item in existing_news)
    new_count = 0
    for item in new_feed_items:
        if item['title'] not in existing_titles:
            # Assign a new ID
            item['id'] = len(existing_news) + 1
            existing_news.append(item)
            existing_titles.add(item['title'])
            new_count += 1

    # Keep only the last 100 items to avoid bloated file
    existing_news = existing_news[-100:]

    with open(news_file, 'w', encoding='utf-8') as f:
        json.dump(existing_news, f, ensure_ascii=False, indent=2)

    print(f"Sync Complete: {len(analyzed_risks)} risks, {new_count} new news items added.")
