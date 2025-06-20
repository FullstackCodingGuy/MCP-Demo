"""
Base model class for all ML models in the fintech inference service
"""

import joblib
import pandas as pd
import numpy as np
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import shap


class BaseModel(ABC):
    """Abstract base class for all ML models"""
    
    def __init__(self, model_name: str, model_path: str = "../data/models"):
        """Initialize base model"""
        self.model_name = model_name
        self.model_path = Path(model_path)
        self.model_path.mkdir(parents=True, exist_ok=True)
        
        self.model = None
        self.feature_columns = None
        self.target_column = None
        self.is_trained = False
        self.training_metrics = {}
        self.feature_importance = None
        
        # SHAP explainer for model interpretability
        self.explainer = None
    
    @abstractmethod
    def create_model(self) -> Any:
        """Create and return the ML model instance"""
        pass
    
    @abstractmethod
    def prepare_features(self, data: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
        """Prepare features and target from raw data"""
        pass
    
    def train(self, data: pd.DataFrame, test_size: float = 0.2, random_state: int = 42) -> Dict:
        """Train the model with given data"""
        print(f"Training {self.model_name} model...")
        
        # Prepare features and target
        X, y = self.prepare_features(data)
        
        if len(X) == 0:
            raise ValueError("No features prepared for training")
        
        # Store feature columns
        self.feature_columns = X.columns.tolist()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Create and train model
        self.model = self.create_model()
        self.model.fit(X_train, y_train)
        
        # Make predictions
        y_pred = self.model.predict(X_test)
        y_pred_proba = None
        
        # Get prediction probabilities if available
        if hasattr(self.model, "predict_proba"):
            y_pred_proba = self.model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        metrics = self._calculate_metrics(y_test, y_pred, y_pred_proba)
        
        # Cross-validation score
        cv_scores = cross_val_score(self.model, X_train, y_train, cv=5, scoring='accuracy')
        metrics["cv_accuracy_mean"] = cv_scores.mean()
        metrics["cv_accuracy_std"] = cv_scores.std()
        
        # Feature importance
        if hasattr(self.model, "feature_importances_"):
            importance_df = pd.DataFrame({
                "feature": self.feature_columns,
                "importance": self.model.feature_importances_
            }).sort_values("importance", ascending=False)
            self.feature_importance = importance_df
        
        # Initialize SHAP explainer
        try:
            self.explainer = shap.TreeExplainer(self.model)
        except:
            try:
                self.explainer = shap.Explainer(self.model, X_train.sample(min(100, len(X_train))))
            except:
                print("Warning: Could not initialize SHAP explainer")
        
        self.training_metrics = metrics
        self.is_trained = True
        
        print(f"Training completed. Accuracy: {metrics['accuracy']:.3f}")
        
        return metrics
    
    def predict(self, data: pd.DataFrame) -> np.ndarray:
        """Make predictions on new data"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        # Prepare features
        X, _ = self.prepare_features(data)
        
        # Ensure same feature columns
        X = X.reindex(columns=self.feature_columns, fill_value=0)
        
        return self.model.predict(X)
    
    def predict_proba(self, data: pd.DataFrame) -> np.ndarray:
        """Get prediction probabilities"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        if not hasattr(self.model, "predict_proba"):
            raise ValueError("Model does not support probability predictions")
        
        # Prepare features
        X, _ = self.prepare_features(data)
        
        # Ensure same feature columns
        X = X.reindex(columns=self.feature_columns, fill_value=0)
        
        return self.model.predict_proba(X)
    
    def explain_prediction(self, data: pd.DataFrame, sample_idx: int = 0) -> Dict:
        """Get SHAP explanation for a prediction"""
        if not self.is_trained or self.explainer is None:
            raise ValueError("Model must be trained and SHAP explainer initialized")
        
        # Prepare features
        X, _ = self.prepare_features(data)
        X = X.reindex(columns=self.feature_columns, fill_value=0)
        
        if sample_idx >= len(X):
            raise ValueError(f"Sample index {sample_idx} out of range")
        
        # Get SHAP values for the sample
        sample = X.iloc[sample_idx:sample_idx+1]
        shap_values = self.explainer(sample)
        
        # Prepare explanation
        explanation = {
            "prediction": self.model.predict(sample)[0],
            "feature_contributions": {}
        }
        
        if hasattr(self.model, "predict_proba"):
            explanation["probability"] = self.model.predict_proba(sample)[0].tolist()
        
        # Get feature contributions
        if hasattr(shap_values, "values"):
            for i, feature in enumerate(self.feature_columns):
                explanation["feature_contributions"][feature] = {
                    "value": float(sample[feature].iloc[0]),
                    "contribution": float(shap_values.values[0][i])
                }
        
        return explanation
    
    def save_model(self, filepath: Optional[str] = None) -> str:
        """Save the trained model to disk"""
        if not self.is_trained:
            raise ValueError("Model must be trained before saving")
        
        if filepath is None:
            filepath = self.model_path / f"{self.model_name}_model.joblib"
        
        # Save model and metadata
        model_data = {
            "model": self.model,
            "feature_columns": self.feature_columns,
            "target_column": self.target_column,
            "training_metrics": self.training_metrics,
            "feature_importance": self.feature_importance,
            "model_name": self.model_name
        }
        
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
        
        return str(filepath)
    
    def load_model(self, filepath: str) -> None:
        """Load a trained model from disk"""
        model_data = joblib.load(filepath)
        
        self.model = model_data["model"]
        self.feature_columns = model_data["feature_columns"]
        self.target_column = model_data.get("target_column")
        self.training_metrics = model_data.get("training_metrics", {})
        self.feature_importance = model_data.get("feature_importance")
        self.model_name = model_data.get("model_name", self.model_name)
        
        self.is_trained = True
        
        # Reinitialize SHAP explainer
        try:
            self.explainer = shap.TreeExplainer(self.model)
        except:
            print("Warning: Could not reinitialize SHAP explainer")
        
        print(f"Model loaded from {filepath}")
    
    def get_feature_importance(self, top_n: int = 10) -> pd.DataFrame:
        """Get top N most important features"""
        if self.feature_importance is None:
            raise ValueError("Feature importance not available")
        
        return self.feature_importance.head(top_n)
    
    def _calculate_metrics(self, y_true: np.ndarray, y_pred: np.ndarray, 
                          y_pred_proba: Optional[np.ndarray] = None) -> Dict:
        """Calculate evaluation metrics"""
        metrics = {
            "accuracy": accuracy_score(y_true, y_pred),
            "precision": precision_score(y_true, y_pred, average='weighted', zero_division=0),
            "recall": recall_score(y_true, y_pred, average='weighted', zero_division=0),
            "f1": f1_score(y_true, y_pred, average='weighted', zero_division=0)
        }
        
        # Add AUC-ROC for binary classification with probabilities
        if y_pred_proba is not None and len(np.unique(y_true)) == 2:
            try:
                metrics["auc_roc"] = roc_auc_score(y_true, y_pred_proba)
            except ValueError:
                pass  # Skip AUC-ROC if there's an issue
        
        return metrics
    
    def get_model_summary(self) -> Dict:
        """Get a summary of the model"""
        summary = {
            "model_name": self.model_name,
            "is_trained": self.is_trained,
            "n_features": len(self.feature_columns) if self.feature_columns else 0,
            "target_column": self.target_column
        }
        
        if self.is_trained:
            summary.update(self.training_metrics)
        
        return summary
