import os
import docx
import pandas as pd

# Folder locations
input_folder = "./word_files"
csv_output_folder = "./csv_output"

# Make sure output folder exists
os.makedirs(csv_output_folder, exist_ok=True)

def extract_tables_from_word(doc_path):
    doc = docx.Document(doc_path)
    tables = []
    for table in doc.tables:
        table_data = []
        for row in table.rows:
            table_data.append([cell.text.strip() for cell in row.cells])
        tables.append(table_data)
    return tables

def save_tables_to_csv(tables, base_filename):
    for i, table in enumerate(tables):
        df = pd.DataFrame(table[1:], columns=table[0])
        csv_filename = os.path.join(csv_output_folder, f"{base_filename}_table{i+1}.csv")
        df.to_csv(csv_filename, index=False)
        print(f"Saved: {csv_filename}")

def main():
    for filename in os.listdir(input_folder):
        if filename.endswith(".docx"):
            filepath = os.path.join(input_folder, filename)
            print(f"Processing {filename}...")
            tables = extract_tables_from_word(filepath)
            base_filename = os.path.splitext(filename)[0]
            save_tables_to_csv(tables, base_filename)

if __name__ == "__main__":
    main()
