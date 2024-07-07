// src/App.js

import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, Star, Clock, Send, ChevronDown, Search, Settings, Grid, HelpCircle, User, Menu, Inbox, UserPlus, Sliders, MoreHorizontal, Folder, Globe, Zap, Bot } from 'lucide-react';
import './App.css';

// 国家代码到表情的映射
const countryEmoji = {
  'UK': '🇬🇧',
  'USA': '🇺🇸',
  'China': '🇨🇳',
  // 添加更多国家...
};

// 多语言支持
const translations = {
  'en': {
    'compose': 'Compose',
    'email': 'Email',
    'customerInfo': 'Customer Info',
    'aiSettings': 'AI Settings',
    'more': 'More',
    'interested': 'Interested',
    'autoFollowUp': 'Auto Follow-up',
    'userCustomCategory': 'User Custom Category',
    'searchMail': 'Search mail',
    'priceInquiry': 'Price Inquiry',
    'summary': 'Customer inquired about the monthly cost of 1Gbps IP Transit and a half rack 5Kw in London.',
    'customerBusinessDesc': 'Customer Business Description',
    'ourBusinessDesc': 'Our Business Description',
    'additionalInstructions': 'Additional Instructions',
    'collectInfo': 'Collect Customer Info via Search Engine',
    'matchingCustomers': 'Matching Customers',
    'directors': 'Directors',
    'registeredAddress': 'Registered Address',
    'contactInfo': 'Contact Information',
    'sourceInfo': 'Source',
    'details': 'Details'
  },
  'zh': {
    'compose': '撰写',
    'email': '邮件',
    'customerInfo': '客户信息收集',
    'aiSettings': 'AI设置',
    'more': '更多',
    'interested': '有意向',
    'autoFollowUp': '已自动跟进',
    'userCustomCategory': '用户自定义类别',
    'searchMail': '搜索邮件',
    'priceInquiry': '询问报价',
    'summary': '客户询问伦敦1Gbps IP Transit和half rack 5Kw一个月费用',
    'customerBusinessDesc': '客户业务描述',
    'ourBusinessDesc': '我司业务描述',
    'additionalInstructions': '额外指示',
    'collectInfo': '通过搜索引擎收集客户信息',
    'matchingCustomers': '匹配客户',
    'directors': '董事',
    'registeredAddress': '注册地址',
    'contactInfo': '联系方式',
    'sourceInfo': '信息来源',
    'details': '详细信息'
  }
};

const EmailItem = ({ name, reason, email, company, employee, country, summary, language }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-grow">
          <input type="checkbox" className="mr-4 text-blue-600 focus:ring-blue-500 rounded"/>
          <Star size={18} className="text-gray-400 mr-4 cursor-pointer hover:text-yellow-400"/>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex items-center">
          <span className="text-blue-600 flex items-center mr-4">
            <Bot size={16} className="mr-1 text-green-500"/>
            {translations[language][reason]}
          </span>
          <MoreHorizontal 
            size={18} 
            className="text-gray-400 cursor-pointer hover:text-blue-600" 
            onClick={() => setShowDetails(!showDetails)}
          />
        </div>
      </div>
      <div className="mt-2 ml-10 text-gray-600 text-sm flex items-start">
        <Bot size={16} className="mr-2 mt-1 flex-shrink-0 text-green-500"/>
        <span className="flex-grow">{translations[language][summary]}</span>
      </div>
      {showDetails && (
        <div className="mt-4 ml-10 text-gray-600 space-y-1 bg-gray-50 p-3 rounded-md">
          <div><span className="font-semibold">Email:</span> {email}</div>
          <div><span className="font-semibold">{translations[language].company}:</span> {company}</div>
          <div><span className="font-semibold">{translations[language].employee}:</span> {employee}</div>
          <div><span className="font-semibold">{translations[language].country}:</span> {countryEmoji[country] || country}</div>
        </div>
      )}
    </div>
  );
};

const SearchResults = ({ results, language }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h3 className="text-xl font-bold mb-4">{translations[language].matchingCustomers}</h3>
      {results.map((result, index) => (
        <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
          <h4 className="text-lg font-semibold">{result.name}</h4>
          <div className="flex items-center mt-2">
            <Globe className="mr-2 text-gray-500" size={16} />
            <a href={result.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {result.website}
            </a>
          </div>
          <div className="mt-2">
            <strong>{translations[language].directors}：</strong>
            {result.directors.map((director, idx) => (
              <span key={idx} className="mr-2">{director}</span>
            ))}
            <span className="text-sm text-gray-500">
              ({translations[language].sourceInfo}: {result.directorSource})
            </span>
          </div>
          <div className="mt-2">
            <strong>{translations[language].registeredAddress}：</strong>{result.address}
            <span className="text-sm text-gray-500"> ({translations[language].sourceInfo}: {result.addressSource})</span>
          </div>
          <div className="mt-2">
            <strong>{translations[language].contactInfo}：</strong>
            <div className="flex items-center mt-1">
              <Mail className="mr-2 text-gray-500" size={16} />
              <span>{result.email}</span>
            </div>
            <div className="flex items-center mt-1">
              <Phone className="mr-2 text-gray-500" size={16} />
              <span>{result.phone}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({translations[language].sourceInfo}: {result.contactSource})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const CustomerInfoCollection = ({ language }) => {
  const [customerBusiness, setCustomerBusiness] = useState('');
  const [ourBusiness, setOurBusiness] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const collectCustomerInfo = () => {
    // 模拟搜索结果
    const mockResults = [
      {
        name: "27FIBRE LTD",
        website: "https://27fibre.co.uk/",
        directors: ["HEWSON, Ryan Martin Lee", "THOMAS, Fay"],
        directorSource: "https://find-and-update.company-information.service.gov.uk/company/14729668/",
        address: "Bartle House, Oxford Court, Manchester, England, M2 3WQ",
        addressSource: "govuk officers",
        email: "sales@27fibre.co.uk",
        phone: "0161 987 5005",
        contactSource: "https://27fibre.co.uk/contact-us/"
      }
    ];

    setSearchResults(mockResults);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">{translations[language].customerInfo}</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerBusiness">
            {translations[language].customerBusinessDesc}
          </label>
          <input
            id="customerBusiness"
            type="text"
            value={customerBusiness}
            onChange={(e) => setCustomerBusiness(e.target.value)}
            className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ourBusiness">
            {translations[language].ourBusinessDesc}
          </label>
          <input
            id="ourBusiness"
            type="text"
            value={ourBusiness}
            onChange={(e) => setOurBusiness(e.target.value)}
            className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="additionalInstructions">
            {translations[language].additionalInstructions}
          </label>
          <textarea
            id="additionalInstructions"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
            placeholder={translations[language].additionalInstructions + "..."}
          />
        </div>

        <button
          onClick={collectCustomerInfo}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
        >
          <Search size={18} className="mr-2" />
          {translations[language].collectInfo}
        </button>
      </div>

      {searchResults && <SearchResults results={searchResults} language={language} />}
    </div>
  );
};
  
const App = () => {
  const [activeTab, setActiveTab] = useState('interested');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('Email');
  const [language, setLanguage] = useState('zh');
  const [showLanguageSettings, setShowLanguageSettings] = useState(false);
  const languageSettingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageSettingsRef.current && !languageSettingsRef.current.contains(event.target)) {
        setShowLanguageSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSettingsToggle = () => {
    setShowLanguageSettings(!showLanguageSettings);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setShowLanguageSettings(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'Email':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center flex-1 mr-4">
                <Search size={20} className="text-gray-400 mr-2"/>
                <input type="text" placeholder={translations[language].searchMail} className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-200"/>
              </div>
              <div className="flex items-center space-x-4">
                <div ref={languageSettingsRef} className="relative">
                  <Settings 
                    size={20} 
                    className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200" 
                    onClick={handleLanguageSettingsToggle}
                  />
                  {showLanguageSettings && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button onClick={() => handleLanguageChange('en')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">English</button>
                        <button onClick={() => handleLanguageChange('zh')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left">中文</button>
                      </div>
                    </div>
                  )}
                </div>
                <Grid size={20} className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200"/>
                <img src="https://placehold.co/40x40" alt="User avatar" className="h-8 w-8 rounded-full"/>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {['interested', 'autoFollowUp', 'userCustomCategory'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'interested' && <Star size={18} className="mr-2"/>}
                    {tab === 'autoFollowUp' && <Send size={18} className="mr-2"/>}
                    {tab === 'userCustomCategory' && <Folder size={18} className="mr-2"/>}
                    {translations[language][tab]}
                  </button>
                ))}
              </div>
              <div className="text-gray-600">1-50 of 5,468</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
            <EmailItem 
                name="THOMAS.Fay" 
                reason="priceInquiry" 
                email="THOMAS.Fay@27fibre.co.uk" 
                company="27FIBRE LTD" 
                employee="Thomas Fay" 
                country="UK" 
                summary="summary"
                language={language}
              />
              {/* Add more EmailItem components here */}
            </div>
          </div>
        );
      case 'CustomerInfo':
        return <CustomerInfoCollection language={language} />;
      case 'AISettings':
        return <div className="text-blue-600 text-xl">{translations[language].aiSettings}</div>;
      default:
        return <div className="text-blue-600 text-xl">Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarOpen ? (
        <aside className="w-64 bg-white p-6 border-r border-gray-200">
          <div className="flex items-center mb-8">
            <Menu size={24} className="text-gray-600 mr-4 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}/>
            <img src={process.env.PUBLIC_URL + '/Huicast_Telecom.png'} alt="Huize logo" className="h-8"/>
          </div>
          <button className="flex items-center justify-center w-full py-2 mb-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md">
            <Mail size={18} className="mr-2"/>
            {translations[language].compose}
          </button>
          <nav>
            <ul className="space-y-2">
              {[
                { icon: <Inbox size={18}/>, label: 'email', page: 'Email' },
                { icon: <UserPlus size={18}/>, label: 'customerInfo', page: 'CustomerInfo' },
                { icon: <Sliders size={18}/>, label: 'aiSettings', page: 'AISettings' },
                { icon: <MoreHorizontal size={18}/>, label: 'more', page: '' }
              ].map(({ icon, label, page }) => (
                <li
                  key={label}
                  className={`flex items-center cursor-pointer p-2 rounded-md transition-colors duration-200 ${currentPage === page ? 'text-blue-700 bg-blue-100' : 'text-gray-600 hover:bg-gray-100'}`}
                  onClick={() => page && setCurrentPage(page)}
                >
                  {React.cloneElement(icon, { className: 'mr-4' })}
                  <span>{translations[language][label]}</span>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : (
        <div className="w-16 bg-white p-4 border-r border-gray-200 flex flex-col items-center">
          <Menu size={24} className="text-gray-600 mb-6 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}/>
          <img src={process.env.PUBLIC_URL + '/Huicast_Telecom.png'} alt="Huize logo" className="h-8 w-8 mb-6"/>
        </div>
      )}
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;