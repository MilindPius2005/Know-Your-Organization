import json
from pathlib import Path
import openai
from dotenv import load_dotenv
import os
import sys
import glob

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_all_tables(json_folder: str):
    """Process all JSON files in a folder"""
    all_results = {}
    json_folder = Path(json_folder)
    
    # Debug: Show files being processed
    json_files = list(json_folder.glob("*.json"))
    print(f"Found {len(json_files)} JSON files to process:")
    for f in json_files:
        print(f"- {f.name}")
    
    for json_file in json_files:
        print(f"\nProcessing {json_file.name}...")
        
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Validate JSON structure
            if not all(k in data for k in ['metadata', 'schema', 'data']):
                print(f" Skipping {json_file.name} - invalid structure")
                continue
                
            analysis = analyze_table(data)
            all_results[json_file.stem] = analysis
            print(f" Processed {json_file.name}")
            
        except Exception as e:
            print(f" Failed to process {json_file.name}: {str(e)}")
            continue
    
    return all_results

def analyze_table(table_data: dict):
    """Analyze a single table with AI"""
    prompt = f"""
    Analyze this database table:
    
    Table Name: {table_data['metadata']['table']}
    Schema: {json.dumps(table_data['schema'], indent=2)}
    Sample Rows (3): {json.dumps(table_data['data'][:3], indent=2)}
    
    Provide technical analysis in this format:
    1. **Purpose**: [table purpose]
    2. **Columns**: 
       - [column_name]: [description]
    3. **Recommendations**: [suggestions]
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a SQL database architect."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )
    
    return response.choices[0].message.content

def find_latest_export_folder(base_path: str = ".") -> str:
    """Find the latest export folder starting with 'mysql_exports_'"""
    folders = glob.glob(f"{base_path}/mysql_exports_*")
    if not folders:
        raise FileNotFoundError("No export folders found starting with 'mysql_exports_'")
    latest_folder = max(folders, key=os.path.getmtime)
    return latest_folder

if __name__ == "__main__":
    # Accept folder path as argument or find latest export folder
    if len(sys.argv) > 1:
        folder_path = sys.argv[1]
    else:
        try:
            folder_path = find_latest_export_folder()
        except FileNotFoundError as e:
            print(str(e))
            sys.exit(1)
    
    print(f"Using JSON folder: {folder_path}")
    results = analyze_all_tables(folder_path)
    
    with open("full_analysis.md", "w", encoding="utf-8") as f:
        for table_name, analysis in results.items():
            f.write(f"# {table_name.upper()}\n\n{analysis}\n\n---\n\n")
    
    print(f"\nReport generated with {len(results)} tables analyzed.")
