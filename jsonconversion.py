import mysql.connector
import json
import os
import decimal
from datetime import datetime, date
from pathlib import Path
from mysql.connector import Error

def mysql_to_json():
    """Export all tables from MySQL database to JSON files"""
    # Database configuration
    db_config = {
        'host': 'localhost',
        'user': 'root',
        'password': '1234',
        'database': 'employee_management'
    }
    
    # Create output directory
    output_dir = Path("mysql_exports")
    output_dir.mkdir(exist_ok=True)
    
    connection = None
    try:
        # Connect to MySQL
        print(f"Connecting to MySQL database: {db_config['database']}...")
        connection = mysql.connector.connect(**db_config)
        
        # Verify connection
        try:
            connection.ping(reconnect=True, attempts=3, delay=1)
            print("Connection successful!")
        except Exception as e:
            print(f"Warning: Connection ping failed: {e}")
        
        # Use dictionary cursor
        with connection.cursor(dictionary=True) as cursor:
            # Get all tables
            cursor.execute("SHOW TABLES")
            tables = [row[f"Tables_in_{db_config['database']}"] for row in cursor.fetchall()]
            
            print(f"Found {len(tables)} tables: {', '.join(tables)}")
            
            for table in tables:
                print(f"\nProcessing table: {table}")
                
                # Verify connection before each table
                try:
                    connection.ping(reconnect=True)
                except Exception as e:
                    print(f"Warning: Connection ping failed before processing table {table}: {e}")
                
                # Get schema details
                cursor.execute("""
                    SELECT column_name, data_type, is_nullable, 
                           column_key, column_default, extra
                    FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = %s
                    ORDER BY ordinal_position
                """, (db_config['database'], table))
                schema = cursor.fetchall()
                
                print(f"Retrieved schema with {len(schema)} columns")
                
                # Get table data with chunking
                cursor.execute(f"SELECT * FROM `{table}`")
                data = []
                
                # Fetch all rows in batches
                batch_size = 1000
                batch_count = 0
                total_records = 0
                
                while True:
                    batch = cursor.fetchmany(batch_size)
                    if not batch:
                        break
                    data.extend(batch)
                    batch_count += 1
                    total_records += len(batch)
                    print(f"  Fetched batch {batch_count}: {len(batch)} records")
                
                print(f"Total records retrieved: {total_records}")
                
                # Prepare export structure
                export = {
                    "metadata": {
                        "database": db_config['database'],
                        "table": table,
                        "exported_at": datetime.now().isoformat(),
                        "record_count": len(data),
                        "schema_version": 1.0
                    },
                    "schema": schema,
                    "data": data
                }
                
                # Write to JSON file
                output_file = output_dir / f"{table}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(export, f, indent=2, default=json_serializer, ensure_ascii=False)
                
                print(f"✓ Exported {len(data)} records to {output_file}")
    
    except Error as err:
        print(f"MySQL Error: {err}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("MySQL connection closed")
        print(f"Export complete. Files saved to: {output_dir.absolute()}")
        return output_dir.absolute()

def json_serializer(obj):
    """Handle non-serializable types"""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, bytes):
        return obj.decode('utf-8', errors='replace')
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")

if __name__ == "__main__":
    export_path = mysql_to_json()
    if export_path:
        print(f"\nExport successful! Access your files at: {export_path}")
        # List exported files
        files = list(Path("mysql_exports").glob("*.json"))
        print(f"Exported {len(files)} files:")
        for file in files:
            file_size = os.path.getsize(file) / 1024  # KB
            print(f"  - {file.name} ({file_size:.1f} KB)")
    else:
        print("Export failed. Check the error messages above.")