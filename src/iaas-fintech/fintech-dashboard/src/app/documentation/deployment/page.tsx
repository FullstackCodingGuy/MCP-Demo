'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Server, Cloud, Shield, Settings } from 'lucide-react';

const DeploymentGuidePage = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['docker']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: 'docker',
      title: '🐳 Docker Deployment',
      icon: <Server className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Docker Setup</h4>
            <p className="text-blue-800 text-sm">
              The fastest way to get the Fintech Inference Service running in production
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Docker Compose Setup</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`version: '3.8'
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/fintech
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./models:/app/models
      - ./data:/app/data

  dashboard:
    build: ./fintech-dashboard
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:8000
    depends_on:
      - api

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=fintech
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Deployment Commands</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-2">1. Build and start all services:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded">
                  <code>docker-compose up -d --build</code>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">2. Initialize database:</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded">
                  <code>docker-compose exec api python manage.py migrate</code>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">3. Load sample data (optional):</p>
                <div className="bg-gray-900 text-gray-100 p-3 rounded">
                  <code>docker-compose exec api python manage.py loaddata sample_data.json</code>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Production Considerations</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Use environment-specific docker-compose files</li>
              <li>• Store secrets in a secure secret management system</li>
              <li>• Configure proper logging and monitoring</li>
              <li>• Set up automated backups for PostgreSQL</li>
              <li>• Use a reverse proxy (nginx) for SSL termination</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'kubernetes',
      title: '☸️ Kubernetes Deployment',
      icon: <Cloud className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">Kubernetes Benefits</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Automatic scaling and load balancing</li>
              <li>• High availability and fault tolerance</li>
              <li>• Rolling updates with zero downtime</li>
              <li>• Resource management and monitoring</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Namespace Configuration</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`apiVersion: v1
kind: Namespace
metadata:
  name: fintech-inference
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: fintech-inference
data:
  DATABASE_URL: "postgresql://user:pass@postgres:5432/fintech"
  REDIS_URL: "redis://redis:6379"
  LOG_LEVEL: "INFO"`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">API Service Deployment</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: fintech-api
  namespace: fintech-inference
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fintech-api
  template:
    metadata:
      labels:
        app: fintech-api
    spec:
      containers:
      - name: api
        image: fintech-inference-api:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: app-config
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service and Ingress</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`apiVersion: v1
kind: Service
metadata:
  name: fintech-api-service
  namespace: fintech-inference
spec:
  selector:
    app: fintech-api
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fintech-ingress
  namespace: fintech-inference
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.fintech-inference.com
    secretName: fintech-tls
  rules:
  - host: api.fintech-inference.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: fintech-api-service
            port:
              number: 80`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Horizontal Pod Autoscaler</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fintech-api-hpa
  namespace: fintech-inference
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fintech-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`}</code></pre>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: '🔐 Security Configuration',
      icon: <Shield className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">🚨 Security Checklist</h4>
            <p className="text-red-800 text-sm">
              Ensure all security measures are implemented before production deployment
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Environment Variables Security</h4>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Kubernetes Secrets</h5>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <pre><code>{`apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: fintech-inference
type: Opaque
data:
  DATABASE_PASSWORD: <base64-encoded-password>
  API_KEY: <base64-encoded-api-key>
  JWT_SECRET: <base64-encoded-jwt-secret>`}</code></pre>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Docker Secrets</h5>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
                  <code>docker secret create db_password ./db_password.txt</code>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Network Security</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Firewall Rules</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Block all unnecessary ports</li>
                  <li>• Allow only HTTPS (443) and SSH (22)</li>
                  <li>• Restrict database access to API servers</li>
                  <li>• Use VPC/private networks</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">SSL/TLS Configuration</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use Let's Encrypt certificates</li>
                  <li>• Enforce HTTPS redirects</li>
                  <li>• Set HSTS headers</li>
                  <li>• Disable weak cipher suites</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Application Security</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`# Security headers configuration (nginx)
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">API Security</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <p className="font-medium">Rate Limiting</p>
                  <p className="text-sm text-gray-600">Implement rate limiting to prevent abuse</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <p className="font-medium">Input Validation</p>
                  <p className="text-sm text-gray-600">Validate and sanitize all API inputs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <p className="font-medium">Authentication</p>
                  <p className="text-sm text-gray-600">Use JWT tokens with short expiration</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <p className="font-medium">CORS Configuration</p>
                  <p className="text-sm text-gray-600">Configure CORS for dashboard domains only</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'monitoring',
      title: '📊 Production Monitoring',
      icon: <Settings className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Monitoring Stack</h4>
            <p className="text-purple-800 text-sm">
              Comprehensive monitoring for production observability
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Prometheus Configuration</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'fintech-api'
    static_configs:
      - targets: ['fintech-api-service:80']
    metrics_path: /metrics
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:5432']
    
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Grafana Dashboards</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">API Performance</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Request rate and latency</li>
                  <li>• Error rate by endpoint</li>
                  <li>• Response time percentiles</li>
                  <li>• Active connections</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">ML Model Metrics</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prediction accuracy trends</li>
                  <li>• Model inference time</li>
                  <li>• Feature drift detection</li>
                  <li>• False positive/negative rates</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Infrastructure</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• CPU and memory usage</li>
                  <li>• Disk I/O and network</li>
                  <li>• Database connections</li>
                  <li>• Pod restart count</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Business Metrics</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Daily prediction volume</li>
                  <li>• Customer churn alerts</li>
                  <li>• Fraud detection rate</li>
                  <li>• Revenue impact tracking</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Alerting Rules</h4>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre><code>{`groups:
- name: fintech-api-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High error rate detected
      description: Error rate is {{ $value }} requests/sec

  - alert: HighLatency
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High API latency
      description: 95th percentile latency is {{ $value }}s

  - alert: ModelAccuracyDrop
    expr: ml_model_accuracy < 0.85
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: ML model accuracy dropped
      description: Model accuracy is {{ $value }}`}</code></pre>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Log Aggregation</h4>
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">ELK Stack Configuration</h5>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                <pre><code>{`input {
  beats {
    port => 5044
  }
}

filter {
  if [fields][service] == "fintech-api" {
    grok {
      match => { "message" => "%{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}" }
    }
    
    if [level] == "ERROR" {
      mutate {
        add_tag => [ "error" ]
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "fintech-logs-%{+YYYY.MM.dd}"
  }
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Deployment Guide</h1>
          <p className="text-gray-600">Production deployment guide for the Fintech Inference Service</p>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Deployment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`p-4 border rounded-lg text-left hover:border-blue-300 transition-colors ${
                  expandedSections.includes(section.id) ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center mb-2">
                  {section.icon}
                  <span className="ml-2 font-medium text-gray-900">{section.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center">
                  {section.icon}
                  <h2 className="text-xl font-semibold text-gray-900 ml-3">{section.title}</h2>
                </div>
                {expandedSections.includes(section.id) ? 
                  <ChevronDown className="h-5 w-5 text-gray-500" /> : 
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                }
              </button>
              
              {expandedSections.includes(section.id) && (
                <div className="px-6 pb-6 border-t">
                  <div className="pt-6">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Post-Deployment Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-green-800">
              <li>• Verify all health checks are passing</li>
              <li>• Test API endpoints functionality</li>
              <li>• Confirm database connectivity</li>
              <li>• Validate ML model loading</li>
              <li>• Check dashboard accessibility</li>
            </ul>
            <ul className="space-y-2 text-green-800">
              <li>• Configure monitoring alerts</li>
              <li>• Set up log aggregation</li>
              <li>• Test backup and recovery</li>
              <li>• Verify security configurations</li>
              <li>• Document access credentials</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentGuidePage;
