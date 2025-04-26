import os
import pandas as pd
import json
import uuid

csv_folder = "./csv_output"
json_folder = "./json_output"

os.makedirs(json_folder, exist_ok=True)

def create_json_from_csv(csv_file_path, base_name):
    df = pd.read_csv(csv_file_path)

    table_id = str(uuid.uuid4())
    rows = []
    for _, row in df.iterrows():
        cells = []
        for i, value in enumerate(row):
            cells.append({
                "ColumnID": i+1,
                "LabelText": str(value),
                "VerticalMerge": 1,
                "Metadata": "",
                "LegacyLabelText": ""
            })
        rows.append({
            "ID": _ + 1,
            "HeaderRowText": "",
            "Cells": cells
        })

    json_structure = {
        "$id": "1",
        "$type": "MVX.Events.Work.WorkMethodPublished, RioTinto.AutoHaul.Core",
        "WorkMethodHistoryID": str(uuid.uuid4()),
        "Definition": {
            "$id": "2",
            "$type": "MVX.Domain.Work.WorkMethodDefinition, RioTinto.AutoHaul.Core",
            "Tasks": [],
            "WorkStatements": [],
            "WorkTables": [
                {
                    "$id": "3",
                    "$type": "MVX.Domain.Work.WorkTableDefinition, RioTinto.AutoHaul.Core",
                    "ID": table_id,
                    "Title": "Test Equipment Records",
                    "PreviousVersionTableID": str(uuid.uuid4()),
                    "ManualCompleteAllowed": True,
                    "ShowCurrentProgress": True,
                    "ApplyGlobalChanges": False,
                    "ReferenceName": "Table 1",
                    "Columns": [
                        {"ID": 1, "HeaderText": "Item", "WidthWeight": 1},
                        {"ID": 2, "HeaderText": "Description", "WidthWeight": 1},
                        {"ID": 3, "HeaderText": "Make", "WidthWeight": 1},
                        {"ID": 4, "HeaderText": "Model", "WidthWeight": 1},
                        {"ID": 5, "HeaderText": "Serial Number", "WidthWeight": 1},
                        {"ID": 6, "HeaderText": "Calibration Due Date", "WidthWeight": 1},
                        {"ID": 7, "HeaderText": "Inputted By", "WidthWeight": 1}
                    ],
                    "Rows": rows
                }
            ]
        }
    }

    json_filename = os.path.join(json_folder, base_name + ".json")
    with open(json_filename, "w", encoding="utf-8") as f:
        json.dump(json_structure, f, indent=2)
    print(f"Generated JSON: {json_filename}")

def main():
    for filename in os.listdir(csv_folder):
        if filename.endswith(".csv"):
            base_name = os.path.splitext(filename)[0]
            csv_file_path = os.path.join(csv_folder, filename)
            create_json_from_csv(csv_file_path, base_name)

if __name__ == "__main__":
    main()