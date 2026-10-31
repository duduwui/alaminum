# -*- coding: utf-8 -*-
import json
from scripts.doors_batch1 import DOORS_BATCH_1
from scripts.doors_batch2 import DOORS_BATCH_2
from scripts.doors_batch3 import DOORS_BATCH_3

def run():
    all_batch_doors = {}
    all_batch_doors.update(DOORS_BATCH_1)
    all_batch_doors.update(DOORS_BATCH_2)
    all_batch_doors.update(DOORS_BATCH_3)

    with open("cms_products_db.json", "r", encoding="utf-8") as f:
        products = json.load(f)

    updated_count = 0
    for p in products:
        pid = p.get("id")
        if pid in all_batch_doors:
            door_data = all_batch_doors[pid]
            en_data = door_data["en"]
            ar_data = door_data["ar"]
            ckb_data = door_data["ckb"]

            # Top-level updates
            p["name"] = en_data["name"]
            p["arabicName"] = ar_data["name"]
            p["kurdishName"] = ckb_data["name"]

            p["subCategory"] = en_data.get("subCategory", p.get("subCategory"))
            p["description"] = en_data["description"]
            p["arabicDescription"] = ar_data["description"]
            p["kurdishDescription"] = ckb_data["description"]

            p["features"] = en_data["features"]
            p["specs"] = en_data["specs"]

            # Translations dictionary
            if "translations" not in p or not isinstance(p["translations"], dict):
                p["translations"] = {}

            p["translations"]["en"] = {
                "name": en_data["name"],
                "subCategory": en_data.get("subCategory", p.get("subCategory")),
                "description": en_data["description"],
                "features": en_data["features"],
                "specs": en_data["specs"]
            }

            p["translations"]["ar"] = {
                "name": ar_data["name"],
                "subCategory": ar_data.get("subCategory", "بوابات ومداخل معمارية"),
                "description": ar_data["description"],
                "features": ar_data["features"],
                "specs": ar_data["specs"]
            }

            p["translations"]["ckb"] = {
                "name": ckb_data["name"],
                "subCategory": ckb_data.get("subCategory", "دەروازە و دەرگای سەرەکی ڤێلاکان"),
                "description": ckb_data["description"],
                "features": ckb_data["features"],
                "specs": ckb_data["specs"]
            }

            updated_count += 1

    print(f"Successfully updated {updated_count} door products in cms_products_db.json!")

    with open("cms_products_db.json", "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    # Generate src/data/productionProductsSeed.ts
    seed_content = "import type { ProductItem } from './winhomeData';\n\nexport const PRODUCTION_PRODUCTS_SEED: ProductItem[] = "
    seed_content += json.dumps(products, ensure_ascii=False, indent=2)
    seed_content += ";\n"

    with open("src/data/productionProductsSeed.ts", "w", encoding="utf-8") as f:
        f.write(seed_content)

    print("Successfully updated src/data/productionProductsSeed.ts!")

if __name__ == "__main__":
    run()
