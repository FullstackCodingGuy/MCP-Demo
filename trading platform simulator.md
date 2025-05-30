# Trade Settlement System - Comprehensive Development Prompt

## System Overview

Create a comprehensive Trade Settlement System that facilitates the trading and settlement of financial instruments. The system should handle the entire lifecycle of a trade, from order placement to settlement completion, with appropriate user roles and permissions.

## Architecture

Implement a clean architecture with the following components:

1. **Frontend**: React with TypeScript
   - Use Material-UI for components
   - Implement responsive design
   - State management with React Context or Redux

2. **Backend**: ASP.NET Core with C#
   - Domain-driven design with vertical slices
   - RESTful API endpoints
   - JWT authentication
   - Repository pattern for data access

3. **Project Structure**:
   ```
   src/
     TradeSettlementSystem/
       TradeSettlementSystem.sln
       ClientApp/                           # React frontend
       TradeSettlementSystem.Api/           # API controllers and DTOs
       TradeSettlementSystem.Domain.UserManagement/
       TradeSettlementSystem.Domain.Trading/
       TradeSettlementSystem.Domain.Settlement/
       TradeSettlementSystem.Domain.MarketData/
       TradeSettlementSystem.Domain.Reporting/
       TradeSettlementSystem.Infrastructure.Persistence/
       TradeSettlementSystem.Infrastructure.Identity/
       TradeSettlementSystem.Infrastructure.ExternalServices/
       TradeSettlementSystem.Infrastructure.Messaging/
       TradeSettlementSystem.Shared/        # Shared models and utilities
   ```

## Domain Models

### User Management
- **User**: Represents a system user with authentication details and profile information
  - Properties: Id, Username, Email, FirstName, LastName, PhoneNumber, Address, IsActive, CreatedAt, LastLoginAt
  - Methods: Activate(), Deactivate(), UpdateContactInformation(), RecordLogin(), AddRole()

- **UserRole**: Represents roles for authorization
  - Default roles: Admin, Trader, BackOffice, Customer
  - Properties: Id, Name, Description

### Trading
- **Order**: Represents a trade order
  - Properties: Id, UserId, Symbol, Type (Market/Limit), Side (Buy/Sell), Quantity, LimitPrice, Status, CreatedAt, ExecutedAt, ExecutionPrice, RejectionReason, SettlementId
  - Methods: Execute(), Cancel(), Reject(), SetSettlementId()
  - Enums: OrderType (Market, Limit), OrderSide (Buy, Sell), OrderStatus (Pending, Executed, Cancelled, Rejected)

### Settlement
- **Settlement**: Represents the settlement of an executed trade
  - Properties: Id, OrderId, UserId, Symbol, Type (Buy/Sell), Quantity, Price, TotalAmount, Status, TradeDate, SettlementDate, CreatedAt, CompletedAt, FailureReason, PaymentSettlementId, StockSettlementId
  - Methods: Complete(), Fail()
  - Enums: SettlementType (Buy, Sell), SettlementStatus (Pending, Completed, Failed)

### Market Data
- **StockQuote**: Represents market data for a financial instrument
  - Properties: Symbol, CompanyName, Price, PreviousClose, Open, DayHigh, DayLow, Volume, Timestamp
  - Methods: GetChangeAmount(), GetChangePercentage()

### Portfolio
- **Portfolio**: Represents a user's investment portfolio
  - Properties: Id, UserId, Name, CashBalance, Holdings, CreatedAt, LastUpdatedAt
  - Methods: AddHolding(), RemoveHolding(), UpdateHolding(), DepositCash(), WithdrawCash(), GetTotalValue(), GetHoldingsValue(), GetUnrealizedGainLoss()

- **PortfolioHolding**: Represents a holding in a portfolio
  - Properties: Id, PortfolioId, Symbol, CompanyName, Quantity, AveragePrice, AcquiredAt, LastUpdatedAt
  - Methods: UpdateQuantity(), UpdateQuantityAndPrice(), GetMarketValue(), GetBookValue(), GetUnrealizedGainLoss(), GetUnrealizedGainLossPercentage()

### Reporting
- **TradeReport**: Represents a generated report
  - Properties: Id, Name, Type, StartDate, EndDate, UserId, GeneratedAt, Format, FilePath, Status, Parameters
  - Methods: MarkAsGenerated(), SetFilePath()
  - Enums: ReportType (TradeHistory, Settlement, PortfolioValuation, ProfitAndLoss, Tax), ReportStatus (Pending, Generated, Failed)

## API Endpoints

### Authentication
- POST /api/auth/login - Authenticate user
- POST /api/auth/register - Register new user
- POST /api/auth/change-password - Change user password

### Users
- GET /api/users - Get all users (Admin only)
- GET /api/users/{id} - Get user by ID
- POST /api/users - Create user (Admin only)
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user (Admin only)
- PUT /api/users/{id}/activate - Activate user (Admin only)
- PUT /api/users/{id}/deactivate - Deactivate user (Admin only)

### Orders
- GET /api/orders - Get user's orders
- GET /api/orders/{id} - Get order by ID
- POST /api/orders - Create order
- PUT /api/orders/{id}/cancel - Cancel order
- PUT /api/orders/{id}/execute - Execute order (Admin/BackOffice only)
- PUT /api/orders/{id}/reject - Reject order (Admin/BackOffice only)
- GET /api/orders/pending - Get pending orders (Admin/BackOffice only)

### Settlements
- GET /api/settlements - Get user's settlements
- GET /api/settlements/{id} - Get settlement by ID
- POST /api/settlements/create-from-order/{orderId} - Create settlement from order (Admin/BackOffice only)
- PUT /api/settlements/{id}/complete - Complete settlement (Admin/BackOffice only)
- PUT /api/settlements/{id}/fail - Fail settlement (Admin/BackOffice only)
- GET /api/settlements/pending - Get pending settlements (Admin/BackOffice only)
- GET /api/settlements/pending-for-date - Get pending settlements for date (Admin/BackOffice only)
- GET /api/settlements/by-date-range - Get settlements by date range

### Market Data
- GET /api/market-data/quotes/{symbol} - Get quote for symbol
- GET /api/market-data/quotes - Get quotes for multiple symbols
- GET /api/market-data/top-gainers - Get top gaining stocks
- GET /api/market-data/top-losers - Get top losing stocks
- GET /api/market-data/most-active - Get most active stocks
- GET /api/market-data/historical/{symbol} - Get historical data for symbol
- GET /api/market-data/symbols - Get all available symbols
- GET /api/market-data/search - Search stocks by company name
- POST /api/market-data/quotes - Add quote (Admin only)

### Portfolio
- GET /api/portfolio - Get user's portfolio
- POST /api/portfolio/deposit - Deposit cash to portfolio
- POST /api/portfolio/withdraw - Withdraw cash from portfolio

### Reports
- GET /api/reports - Get user's reports
- GET /api/reports/{id} - Get report by ID
- POST /api/reports - Create report
- GET /api/reports/types - Get available report types
- GET /api/reports/formats - Get available report formats
- GET /api/reports/by-type/{type} - Get reports by type
- GET /api/reports/by-date-range - Get reports by date range

### Dashboard
- GET /api/dashboard/summary - Get dashboard summary data

## Frontend Pages and Components

### Layout Component
- Navigation sidebar with links to all pages
- Header with user information and logout button
- Main content area

### Dashboard Page
- Summary cards for orders, settlements, and portfolio
- Recent activity section showing latest orders and settlements
- Market summary with top gainers and losers
- Charts for portfolio performance and trading activity

### Trading Page
- Order form for placing new orders
- Market data display with current quotes
- Order history table with filtering and sorting
- Order details modal

### Portfolio Page
- Portfolio summary with total value, cash balance, and holdings value
- Holdings table with current market values and unrealized gains/losses
- Portfolio allocation chart
- Cash transaction history
- Deposit/withdraw cash functionality

### Reports Page
- Report generation form
- Report history table
- Report download functionality
- Report parameter configuration based on report type

### User Profile Page
- User information display and edit form
- Password change functionality
- Activity history

## User Roles and Permissions

1. **Admin**
   - Full access to all features
   - Can manage users
   - Can execute and reject orders
   - Can complete and fail settlements

2. **Trader**
   - Can place and cancel orders
   - Can view own portfolio and settlements
   - Can generate reports

3. **BackOffice**
   - Can execute and reject orders
   - Can complete and fail settlements
   - Can view all orders and settlements
   - Cannot place orders

4. **Customer**
   - Can place and cancel orders
   - Can view own portfolio and settlements
   - Can generate reports
   - Limited access to market data

## Business Rules

### Order Processing
1. Users can place market or limit orders
2. Market orders are executed immediately at current market price
3. Limit orders are executed only when the market price reaches the limit price
4. Orders can be cancelled only if they are in pending status
5. Executed orders cannot be modified or cancelled
6. Only Admin and BackOffice users can execute or reject orders

### Settlement Processing
1. Settlements are created from executed orders
2. Settlement date is typically T+2 (trade date plus two business days)
3. Settlements can be completed or failed
4. Completed settlements update the user's portfolio
5. Failed settlements require a reason and may need to be reprocessed
6. Only Admin and BackOffice users can complete or fail settlements

### Portfolio Management
1. Users can deposit or withdraw cash from their portfolio
2. Cannot withdraw more cash than available balance
3. Portfolio holdings are updated when settlements are completed
4. Portfolio value is calculated based on current market prices
5. Unrealized gains/losses are calculated based on average purchase price

### Reporting
1. Users can generate various types of reports
2. Reports can be downloaded in different formats (PDF, CSV, XLSX, HTML)
3. Reports are generated asynchronously and stored for later access
4. Reports have parameters specific to their type

## Mock Data

### Users
- Admin user with all roles
- Trader user with Trader role
- BackOffice user with BackOffice role
- Customer user with Customer role

### Market Data
- 20+ stock symbols with realistic price data
- Historical data for the past 30 days
- Regular price updates during market hours

### Orders and Settlements
- Mix of market and limit orders
- Orders in various statuses (pending, executed, cancelled, rejected)
- Settlements in various statuses (pending, completed, failed)

### Portfolio
- Default portfolio with initial cash balance
- Several holdings with different symbols and quantities

## Technical Requirements

### Backend
- ASP.NET Core 6.0 or later
- Entity Framework Core for data access (or mock repositories for demonstration)
- JWT authentication with role-based authorization
- Swagger for API documentation
- Proper error handling and logging

### Frontend
- React 17 or later with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls
- Chart.js or Recharts for data visualization
- Form validation with Formik or React Hook Form

### Development Environment
- Visual Studio 2022 or VS Code
- Node.js 14+ for frontend development
- Git for version control

## Implementation Steps

1. Set up project structure and solution
2. Create domain models and repository interfaces
3. Implement API controllers and DTOs
4. Configure authentication and authorization
5. Create mock repositories for testing
6. Set up React frontend with routing
7. Implement UI components and pages
8. Connect frontend to backend API
9. Add charts and data visualization
10. Implement error handling and validation
11. Test all features and use cases
12. Document API and usage instructions

## Testing Scenarios

1. User registration and login
2. Placing market and limit orders
3. Order execution and settlement
4. Portfolio management and valuation
5. Report generation and download
6. Role-based access control
7. Error handling and validation
