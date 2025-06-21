import duckdb
import pandas as pd
import os

DB_FILE = os.path.join(os.path.dirname(__file__), 'database.db')

def create_database():
    """Creates a DuckDB database from CSV files."""
    conn = duckdb.connect(DB_FILE)
    conn.execute("""
    CREATE OR REPLACE TABLE customers (
        customer_id VARCHAR PRIMARY KEY,
        segment VARCHAR
    );
    """)
    conn.execute("""
    CREATE OR REPLACE TABLE transactions (
        transaction_id VARCHAR PRIMARY KEY,
        customer_id VARCHAR,
        transaction_date TIMESTAMP,
        amount DECIMAL(10, 2)
    );
    """)
    customers_df = pd.read_csv(
        os.path.join(os.path.dirname(__file__), '../iaas-fintech/fintech-inference-service/data/raw/customers.csv'),
        dtype={'customer_id': str}
    )
    transactions_df = pd.read_csv(
        os.path.join(os.path.dirname(__file__), '../iaas-fintech/fintech-inference-service/data/raw/transactions.csv'),
        dtype={'customer_id': str, 'transaction_id': str},
        parse_dates=['transaction_date']
    )

    customers_df = customers_df[['customer_id', 'segment']]
    transactions_df = transactions_df[['transaction_id', 'customer_id', 'transaction_date', 'amount']]

    conn.register('customers_df', customers_df)
    conn.register('transactions_df', transactions_df)

    conn.execute('INSERT INTO customers SELECT * FROM customers_df')
    conn.execute('INSERT INTO transactions SELECT * FROM transactions_df')

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
