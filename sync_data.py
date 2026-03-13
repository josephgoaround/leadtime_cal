import json
import re
import os
import random
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# --- CONFIGURATION: Comprehensive Global SCM & Logistics Feeds ---
RSS_FEEDS = [
    "https://gcaptain.com/feed/",
    "https://www.shippingazette.com/rss/news.xml",
    "https://www.supplychaindive.com/feeds/news/",
    "https://www.freightwaves.com/feed",
    "https://www.logisticsmgmt.com/rss/all",
    "https://www.worldcargonews.com/feed/",
    "https://container-news.com/feed/",
    "https://splash247.com/feed/"
]

EXPERTS = ["Marcus Vane", "Elena Rossi", "Kaito Tanaka"]

# Define Risk Keywords and their Impact (SCM Expert Tuning)
RISK_RULES = [
    {"keywords": ["Suez", "Red Sea", "Houthi", "Bab el-Mandeb"], "id": "suez_disruption", "label": "Suez/Red Sea Rerouting", "delay": 12, "cost": 1500},
    {"keywords": ["Hormuz", "Iran", "Strait"], "id": "hormuz_disruption", "label": "Strait of Hormuz Alert", "delay": 5, "cost": 800},
    {"keywords": ["Panama", "Drought", "Water", "Gatun"], "id": "panama_disruption", "label": "Panama Canal Restriction", "delay": 6, "cost": 700},
    {"keywords": ["Strike", "Labor", "Union", "ILA", "ILA strike"], "id": "port_strike", "label": "Port Labor Action", "delay": 4, "cost": 400},
    {"keywords": ["Congestion", "Backlog", "Queue"], "id": "port_congestion", "label": "Port Congestion Warning", "delay": 3, "cost": 200},
    {"keywords": ["Hurricane", "Typhoon", "Cyclone", "Storm"], "id": "weather_severe", "label": "Extreme Weather Impact", "delay": 3, "cost": 250},
    {"keywords": ["Cyber", "Hack", "Ransomware"], "id": "cyber_attack", "label": "Digital Infrastructure Risk", "delay": 2, "cost": 300}
]

def fetch_and_analyze_risks():
    print("Fetching and analyzing global SCM intelligence...")
    alerts = []
    active_risks = {} 
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
                    description_node = item.find('description')
                    description = description_node.text if description_node is not None else ""
                    
                    # Clean description
                    if description:
                        description = re.sub('<[^<]+?>', '', description)
                        description = description.replace('&nbsp;', ' ').strip()
                        description = description[:350] + "..." if len(description) > 350 else description
                    
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
                            
                    # General alerts for marquee
                    alerts.append({
                        "msg": title,
                        "url": link,
                        "time": datetime.now().strftime("%H:%M")
                    })
                    
                    # Categorization logic
                    category = "Liner News"
                    t_low = title.lower()
                    if any(kw in t_low for kw in ["port", "terminal", "berth", "strike", "labor"]): category = "Port Status"
                    if any(kw in t_low for kw in ["ai", "tech", "digital", "data", "blockchain", "visibility"]): category = "Logistics Technology"
                    if any(kw in t_low for kw in ["esg", "carbon", "emission", "green", "sustainable"]): category = "Sustainability"
                    
                    new_feed_items.append({
                        "date": datetime.now().strftime("%Y-%m-%d"),
                        "time": datetime.now().strftime("%H:%M"),
                        "category": category,
                        "title": title,
                        "content": description if description else title,
                        "author": random.choice(EXPERTS),
                        "tags": [category.split()[0], "SCM_Expert"]
                    })
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            
    return alerts, list(active_risks.values()), new_feed_items

if __name__ == "__main__":
    data_dir = 'data'
    if not os.path.exists(data_dir): os.makedirs(data_dir)
    
    alerts, analyzed_risks, new_feed_items = fetch_and_analyze_risks()
    
    # Update maritime_data.json (Active status)
    output = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "active_risks": analyzed_risks,
        "alerts": alerts[:20] # Keep marquee lean
    }
    
    with open(os.path.join(data_dir, 'maritime_data.json'), 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Update news.json (Archive)
    news_file = os.path.join(data_dir, 'news.json')
    existing_news = []
    if os.path.exists(news_file):
        with open(news_file, 'r', encoding='utf-8') as f:
            try: existing_news = json.load(f)
            except: existing_news = []

    existing_titles = set(item['title'] for item in existing_news)
    new_count = 0
    
    # ONLY TAKE ONE NEW ITEM PER RUN (As requested: 2 hours 1 article)
    for item in new_feed_items:
        if item['title'] not in existing_titles:
            # Found the latest new item
            item['id'] = len(existing_news) + 1
            existing_news.insert(0, item) # Insert at beginning
            existing_titles.add(item['title'])
            new_count = 1
            break # STOP AFTER ONE ARTICLE

    # Keep only the last 150 items
    existing_news = existing_news[:150]

    with open(news_file, 'w', encoding='utf-8') as f:
        json.dump(existing_news, f, ensure_ascii=False, indent=2)

    print(f"Expert Sync Complete: {len(analyzed_risks)} active risks found. {new_count} new intelligence items added.")
