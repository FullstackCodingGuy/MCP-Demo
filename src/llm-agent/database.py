import duckdb
import pandas as pd
import os

DB_FILE = os.path.join(os.path.dirname(__file__), 'database.db')

def setup_database_from_csvs(customers_csv_path, transactions_csv_path):
    """Creates and sets up the DuckDB database from CSV files."""
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

    conn = duckdb.connect(DB_FILE)

    try:
        conn.execute("""
        CREATE TABLE customers (
            customer_id VARCHAR PRIMARY KEY,
            segment VARCHAR
        );
        """)
        conn.execute("""
        CREATE TABLE transactions (
            transaction_id VARCHAR PRIMARY KEY,
            customer_id VARCHAR,
            transaction_date TIMESTAMP,
            amount DECIMAL(10, 2)
        );
        """)

        customers_df = pd.read_csv(customers_csv_path, dtype={'customer_id': str})
        transactions_df = pd.read_csv(transactions_csv_path, dtype={'customer_id': str, 'transaction_id': str}, parse_dates=['transaction_date'])

        customers_df = customers_df[['customer_id', 'segment']]
        transactions_df = transactions_df[['transaction_id', 'customer_id', 'transaction_date', 'amount']]

        conn.register('customers_df', customers_df)
        conn.register('transactions_df', transactions_df)
        conn.execute('INSERT INTO customers SELECT * FROM customers_df')
        conn.execute('INSERT INTO transactions SELECT * FROM transactions_df')

        customer_count = conn.execute("SELECT COUNT(*) FROM customers").fetchone()[0]
        transaction_count = conn.execute("SELECT COUNT(*) FROM transactions").fetchone()[0]

        print(f"Number of records inserted into customers: {len(customers_df)}")
        print(f"Number of records available in customers table: {customer_count}")
        print(f"Number of records inserted into transactions: {len(transactions_df)}")
        print(f"Number of records available in transactions table: {transaction_count}")

        if not (customer_count == len(customers_df) and transaction_count == len(transactions_df)):
            raise Exception("Data verification failed. Counts do not match.")

        conn.execute("CREATE INDEX idx_cust_id ON customers(customer_id);")
        conn.execute("CREATE INDEX idx_txn_cust_id ON transactions(customer_id);")

        return customer_count, transaction_count

    finally:
        conn.close()

def get_top_customers(month: str):
    """Gets the top 5 customers for a given month."""
    conn = duckdb.connect(DB_FILE)
    query = f"""
    SELECT c.customer_id, SUM(t.amount) AS total_spent
    FROM customers c
    JOIN transactions t ON c.customer_id = t.customer_id
    WHERE EXTRACT(YEAR FROM t.transaction_date) || '-' || LPAD(EXTRACT(MONTH FROM t.transaction_date)::VARCHAR, 2, '0') = '{month}'
    GROUP BY c.customer_id
    ORDER BY total_spent DESC
    LIMIT 5;
    """
    result = conn.execute(query).fetchall()
    conn.close()
    return result
