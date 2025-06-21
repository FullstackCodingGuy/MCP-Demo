'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION_CONFIG, BRAND_CONFIG } from '@/config/navigation';
import { ChevronDown, Bell, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActiveSection = (sectionItems: any[]) => {
    return sectionItems.some(item => item.href === pathname);
  };

  const isActiveItem = (href: string) => {
    return pathname === href;
  };

  const handleDropdownToggle = (sectionTitle: string) => {
    setActiveDropdown(activeDropdown === sectionTitle ? null : sectionTitle);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight">
                  {BRAND_CONFIG.title}
                </span>
                <span className="text-xl font-light text-blue-100">
                  {BRAND_CONFIG.accent}
                </span>
              </div>
              <span className="text-xs text-blue-200 uppercase tracking-wide">
                {BRAND_CONFIG.subtitle}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAVIGATION_CONFIG.map((section) => {
              const isActive = isActiveSection(section.items);
              const isOpen = activeDropdown === section.title;

              return (
                <div key={section.title} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(section.title)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-white/20 text-white border-b-2 border-white/50' 
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">
                      {section.title.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                      <div className="p-4">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 border-b border-gray-100 pb-2">
                          {section.title}
                        </div>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <Link
                              key={item.key}
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={`
                                flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                                ${isActiveItem(item.href)
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'text-gray-700 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className={`
                                flex items-center justify-center w-10 h-10 rounded-lg text-lg
                                ${isActiveItem(item.href)
                                  ? 'bg-blue-100'
                                  : 'bg-gray-100'
                                }
                              `}>
                                {item.icon}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-semibold text-sm">
              J
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </header>
  );
};

export default Navigation;
