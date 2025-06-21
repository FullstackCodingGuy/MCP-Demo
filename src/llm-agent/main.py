from database import create_database, get_top_customers
import traceback

def main():
    """Main function to run the LLM agent."""
    try:
        create_database()
        top_customers = get_top_customers('2025-05')
        print("Top 5 customers last month:")
        for customer, total_spent in top_customers:
            print(f"- {customer}: ${total_spent:.2f}")
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    main()
