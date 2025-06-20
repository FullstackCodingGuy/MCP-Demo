#!/bin/bash

# Fintech Inference Service Setup Script
echo "🏦 Setting up Fintech Inference Service..."

# Check Python version
python_version=$(python3 --version 2>&1)
if [[ $? -ne 0 ]]; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Found $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating data directories..."
mkdir -p data/raw data/processed data/models

# Generate sample data
echo "🎲 Generating sample transaction data..."
python src/data/data_generator.py

# Engineer features
echo "🔧 Engineering features..."
python src/data/feature_engineering.py

# Train models
echo "🤖 Training ML models..."
python src/models/churn_model.py

# Run tests
echo "🧪 Running tests..."
pytest tests/ -v

echo "✅ Setup completed successfully!"
echo ""
echo "🚀 To start the services:"
echo "   API Server:  uvicorn src.api.main:app --reload --host 0.0.0.0 --port 8000"
echo "   Dashboard:   streamlit run src/dashboard/app.py"
echo ""
echo "📖 API Documentation: http://localhost:8000/docs"
echo "📊 Dashboard:         http://localhost:8501"
