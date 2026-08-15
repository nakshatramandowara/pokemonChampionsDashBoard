import requests, json
B = "https://play.limitlesstcg.com/api"

tours = requests.get(B+"/tournaments", params={"game":"VGC","limit":10}).json()
print(f"{len(tours)} tournaments")

for t in tours:
    s = requests.get(f"{B}/tournaments/{t['id']}/standings").json()
    sheet = next((p["decklist"] for p in s if p.get("decklist")), None)
    if sheet:
        print(f"\nfrom: {t['name']}  (format {t.get('format')})")
        print(json.dumps(sheet[0], indent=2))
        break
else:
    print("no decklists in the last 10 tournaments")

    