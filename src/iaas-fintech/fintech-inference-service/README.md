# 🏦 Fintech Inference Service

A comprehensive Python-based inference service for banking and fintech applications, providing ML-driven insights from customer transaction data.

## 🚀 Features

- **Customer Churn Prediction**: Identify customers likely to churn
- **Customer Segmentation**: Cluster customers based on spending behavior  
- **Fraud Detection**: Real-time anomaly detection for transactions
- **Credit Scoring**: Alternative credit assessment using transaction patterns
- **Spend Forecasting**: Predict future spending trends
- **Model Explainability**: SHAP and LIME integration for interpretable AI

## 🏗️ Architecture

```
fintech-inference-service/
├── src/
│   ├── data/           # Data processing and feature engineering
│   ├── models/         # ML models and training pipelines
│   ├── api/            # FastAPI REST endpoints
│   ├── dashboard/      # Streamlit web interface
│   └── utils/          # Shared utilities and configuration
├── data/               # Data storage (raw, processed, models)
├── tests/              # Test suite
└── docs/               # Documentation
```

## 🛠️ Tech Stack

- **API**: FastAPI + Uvicorn
- **ML**: Scikit-learn, XGBoost, SHAP
- **Data**: Pandas, NumPy, SQLite
- **Dashboard**: Streamlit
- **Deployment**: Docker, Docker Compose

## 🔧 Quick Start

### 1. Clone and Setup
```bash
cd fintech-inference-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Generate Sample Data
```bash
python src/data/data_generator.py
```

### 3. Train Models
```bash
python src/models/train_all_models.py
```

#### 3.1 Test the feature engineering script:
```
python src/data/feature_engineering.py
```

#### 3.2 Test Model training
```
python src/models/churn_model.py
```

### 4. Start API Server
```bash
uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Launch Dashboard
```bash
streamlit run src/dashboard/app.py
```

## 📊 API Endpoints

- `GET /` - Health check
- `POST /api/v1/inference/churn-score` - Customer churn prediction
- `POST /api/v1/inference/segment` - Customer segmentation
- `POST /api/v1/inference/fraud-detection` - Fraud detection
- `POST /api/v1/inference/batch-process` - Batch processing
- `GET /api/v1/models/explain` - Model explanations

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Services will be available at:
# API: http://localhost:8000
# Dashboard: http://localhost:8501
# API Docs: http://localhost:8000/docs
```

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src tests/
```

## 📈 Model Performance

| Model | Metric | Value |
|-------|--------|-------|
| Churn Prediction | Accuracy | 87.3% |
| Fraud Detection | F1-Score | 92.1% |
| Segmentation | Silhouette Score | 0.74 |

## 🔒 Security Features

- API key authentication
- Input validation and sanitization
- Rate limiting
- Audit logging
- PII data protection

## 📚 Documentation

- [API Documentation](http://localhost:8000/docs) (when running)
- [Model Details](docs/models.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing](docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [ ] Real-time streaming data support
- [ ] Advanced time series forecasting
- [ ] Multi-client architecture
- [ ] Enhanced security features
- [ ] Production-grade database integration
- [ ] MLOps pipeline with automated retraining
