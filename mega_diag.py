import json
idx = json.load(open("index_cache.json"))
i=0
while i<=500:
    i+=1
    if(idx.get("pokemon", [])[i]["name"]=='Charizard'):
        print(idx.get("pokemon", [])[i])
        break