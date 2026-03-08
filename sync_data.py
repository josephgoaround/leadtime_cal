import json
import re
import os
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime

# --- CONFIGURATION ---
RSS_FEEDS = ["https://gcaptain.com/feed/"]

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
    
    for url in RSS_FEEDS:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                root = ET.fromstring(response.read())
                
                for item in root.findall('.//item')[:10]:
                    title = item.find('title').text
                    link = item.find('link').text
                    
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
        except: pass
            
    return alerts, list(active_risks.values())

if __name__ == "__main__":
    data_dir = 'data'
    if not os.path.exists(data_dir): os.makedirs(data_dir)
    
    alerts, analyzed_risks = fetch_and_analyze_risks()
    
    output = {
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "active_risks": analyzed_risks,
        "alerts": alerts
    }
    
    with open(os.path.join(data_dir, 'maritime_data.json'), 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"Sync Complete: {len(analyzed_risks)} active risks identified.")
