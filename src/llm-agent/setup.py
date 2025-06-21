import subprocess
import sys
import os
from database import setup_database_from_csvs

def install_requirements():
    """Installs packages from requirements.txt."""
    print("Installing requirements...")
    try:
        requirements_path = os.path.join(os.path.dirname(__file__), 'requirements.txt')
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', requirements_path])
        print("Requirements installed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        print("Please ensure that 'requirements.txt' exists in the same directory as setup.py and that pip is installed.")
        sys.exit(1)
    except FileNotFoundError:
        print("Error: requirements.txt not found.")
        print("Please ensure that 'requirements.txt' exists in the same directory as setup.py.")
        sys.exit(1)

def setup_database():
    """Sets up the DuckDB database."""
    print("Setting up database...")
    try:
        customers_csv = os.path.join(os.path.dirname(__file__), '../iaas-fintech/fintech-inference-service/data/raw/customers.csv')
        transactions_csv = os.path.join(os.path.dirname(__file__), '../iaas-fintech/fintech-inference-service/data/raw/transactions.csv')
        setup_database_from_csvs(customers_csv, transactions_csv)
        print("Database setup successful.")
    except Exception as e:
        print(f"Error setting up database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    install_requirements()
    setup_database()
    print("Setup complete.")
