import pandas as pd

file_path = '/workspaces/MCP-Demo/src/iaas-fintech/fintech-inference-service/data/raw/transactions.csv'
df = pd.read_csv(file_path)

duplicates = df.duplicated(subset=['transaction_id'], keep=False)

if duplicates.any():
    print(f"Found {df.duplicated(subset=['transaction_id']).sum()} duplicate transaction_ids. Fixing...")
    
    # Find the maximum transaction number to generate new unique IDs
    max_txn_num = df['transaction_id'].str.extract(r'TXN_(\d+)').astype(int).max().iloc[0]
    
    # Generate new unique transaction IDs for duplicates
    new_txn_ids = []
    for index, row in df[duplicates].iterrows():
        max_txn_num += 1
        new_txn_ids.append(f'TXN_{max_txn_num:06d}')

    # Update the DataFrame with new transaction IDs
    df.loc[duplicates, 'transaction_id'] = new_txn_ids
    
    # Save the updated DataFrame
    df.to_csv(file_path, index=False)
    print("Duplicate transaction_ids have been fixed.")
else:
    print("No duplicate transaction_ids found.")
