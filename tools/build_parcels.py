"""Download every Davidson County parcel and write a compact address-to-acres table.

Needs maps.nashville.gov allowed in the cloud environment's network settings.
Output: one JSON file shaped {"ZIP": {"STREET": {"HOUSE": acres}}}, streets single-spaced and upper case.
Run from the repo root: python3 -I tools/build_parcels.py data/parcels.json
"""
import json, os, sys, time, urllib.parse, urllib.request

URL = "https://maps.nashville.gov/arcgis/rest/services/Cadastral/Parcels/MapServer/0/query"
FIELDS = "OBJECTID,PropHouse,PropStreet,PropZip,Acres,DeededAcreage"


def get(params):
    q = urllib.parse.urlencode({**params, "f": "json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(f"{URL}?{q}", timeout=60) as r:
                return json.load(r)
        except Exception as e:
            print("retry", attempt, e, file=sys.stderr)
            time.sleep(2 ** attempt)
    raise SystemExit("county server unreachable")


def main(out_path):
    table, last, n = {}, -1, 0
    while True:
        d = get({"where": f"OBJECTID>{last}", "outFields": FIELDS, "returnGeometry": "false",
                 "orderByFields": "OBJECTID", "resultRecordCount": 2000})
        feats = d.get("features", [])
        if not feats:
            break
        for f in feats:
            a = f["attributes"]
            last = max(last, a["OBJECTID"])
            house, street, zip_ = a.get("PropHouse"), a.get("PropStreet"), a.get("PropZip")
            acres = a.get("Acres") or a.get("DeededAcreage")
            if not (house and street and zip_ and acres):
                continue
            street = " ".join(str(street).upper().split())
            table.setdefault(str(zip_)[:5], {}).setdefault(street, {})[str(house).strip()] = round(float(acres), 2)
            n += 1
        print(n, "parcels so far", file=sys.stderr)
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w") as fh:
        json.dump(table, fh, separators=(",", ":"), sort_keys=True)
    print("done:", n, "parcels written to", out_path, file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/parcels.json")
