'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, FileText, Code, Users, Settings, BarChart3, Rocket, ScrollText } from 'lucide-react';

const DocumentationPage = () => {
  const documentationSections = [
    {
      title: 'Setup Guide',
      description: 'Complete setup and installation instructions',
      icon: <Rocket className="h-8 w-8 text-green-600" />,
      href: '/documentation/setup',
      topics: ['Installation', 'Configuration', 'Quick Start', 'Performance Metrics']
    },
    {
      title: 'API Documentation',
      description: 'Complete API reference with interactive examples',
      icon: <Code className="h-8 w-8 text-blue-500" />,
      href: '/api-documentation',
      topics: ['Endpoints', 'Authentication', 'Rate Limits', 'Error Handling']
    },
    {
      title: 'Churn Prediction Guide',
      description: 'Comprehensive guide to churn prediction models',
      icon: <BarChart3 className="h-8 w-8 text-green-500" />,
      href: '/documentation/churn-prediction',
      topics: ['Model Architecture', 'Feature Engineering', 'Performance Metrics', 'Business Impact']
    },
    {
      title: 'Feature Engineering',
      description: 'Data preprocessing and feature creation documentation',
      icon: <Settings className="h-8 w-8 text-purple-500" />,
      href: '/feature-engineering',
      topics: ['Customer Features', 'Transaction Features', 'Pipeline Process', 'Best Practices']
    },
    {
      title: 'Implementation Guide',
      description: 'Step-by-step implementation instructions',
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      href: '/documentation/implementation',
      topics: ['Setup', 'Configuration', 'Deployment', 'Monitoring']
    },
    {
      title: 'Deployment Guide',
      description: 'Production deployment and operations',
      icon: <Users className="h-8 w-8 text-red-500" />,
      href: '/documentation/deployment',
      topics: ['Docker', 'Kubernetes', 'Scaling', 'Security']
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: <BookOpen className="h-8 w-8 text-indigo-500" />,
      href: '/documentation/troubleshooting',
      topics: ['Common Errors', 'Performance Issues', 'Debug Tips', 'FAQ']
    },
    {
      title: 'Changelog',
      description: 'Version history and feature updates',
      icon: <ScrollText className="h-8 w-8 text-gray-600" />,
      href: '/documentation/changelog',
      topics: ['Version History', 'New Features', 'Bug Fixes', 'Breaking Changes']
    }
  ];

  const quickLinks = [
    { name: 'Setup Guide', href: '/documentation/setup' },
    { name: 'Getting Started', href: '/documentation/setup' },
    { name: 'API Reference', href: '/api-documentation' },
    { name: 'Model Performance', href: '/model-insights' },
    { name: 'Customer Management', href: '/customer-management' },
    { name: 'Churn Prediction', href: '/churn-prediction' },
    { name: 'Feature Engineering', href: '/feature-engineering' },
    { name: 'Changelog', href: '/documentation/changelog' }
  ];

  const recentUpdates = [
    {
      title: 'API Documentation Enhanced',
      date: '2024-06-21',
      description: 'Added interactive endpoint testing and code examples'
    },
    {
      title: 'Churn Model v2.1 Released',
      date: '2024-06-18',
      description: 'Improved accuracy by 3.2% with new feature engineering'
    },
    {
      title: 'Dashboard UI Updates',
      date: '2024-06-15',
      description: 'New customer analytics visualizations and filters'
    },
    {
      title: 'Deployment Guide Updated',
      date: '2024-06-12',
      description: 'Added Kubernetes deployment configurations'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Documentation Hub</h1>
          <p className="text-gray-600">Complete documentation and guides for the Fintech Inference Service</p>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {documentationSections.map((section, index) => (
            <Link key={index} href={section.href}>
              <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  {section.icon}
                  <h3 className="text-lg font-semibold text-gray-900 ml-3">{section.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <div className="flex flex-wrap gap-2">
                  {section.topics.map((topic, topicIndex) => (
                    <span
                      key={topicIndex}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Updates</h2>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{update.title}</h4>
                  <span className="text-sm text-gray-500">{update.date}</span>
                </div>
                <p className="text-sm text-gray-600">{update.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
