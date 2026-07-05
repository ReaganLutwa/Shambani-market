/**
 * ShambaNi Chatbot Component
 * A multi-language, role-aware chatbot for farmer and buyer support
 * Supports: English, Luganda, Swahili
 * Integrates with ShambaNi auth system and WhatsApp Business fallback
 * 
 * File: src/components/ShambaNiChatbot/ShambaNiChatbot.jsx
 * GitHub: shambani-market/shambani-market.africa
 */

import React, { useState, useRef, useEffect } from 'react';
import './ShambaNiChatbot.css';

// Language translations
const TRANSLATIONS = {
  en: {
    greeting: "Hello! I'm ShambaNi Assistant. How can I help you today?",
    farmerPrompt: "Are you a farmer or a buyer?",
    farmerHelp: "Great! I can help you with:\n1. Registering your farm\n2. Listing your produce\n3. Verifying your account\n4. Payment questions\n5. Delivery support",
    buyerHelp: "Welcome! I can help you with:\n1. Creating a buyer account\n2. Finding farmers\n3. Placing orders\n4. Payment options\n5. Delivery tracking",
    placeholder: "Type your message...",
    send: "Send",
    minimize: "Minimize",
    newChat: "New Chat",
    typing: "ShambaNi Assistant is typing...",
    connectAgent: "Connect to Human Agent",
    whatsappFallback: "Chat on WhatsApp",
    languageSelect: "Language:",
    categories: {
      registration: "Account Registration",
      listing: "List Produce",
      orders: "Orders & Delivery",
      payments: "Payments",
      verification: "Verification",
      complaints: "Complaints"
    }
  },
  lg: {
    greeting: "Oli otya! Nze ShambaNi Assistant. Nnyinza kukuyamba ntya?",
    farmerPrompt: "Oli mulimi oba muguzi?",
    farmerHelp: "Kirungi! Nnyinza kukuyamba ku:\n1. Okwewandiisa ekifo ky'okulima\n2. Okuteeka ebintu byo ku mboli\n3. Okukakasa akawunti yo\n4. Ebibuuzo by'ensimbi\n5. Okutwala ebintu",
    buyerHelp: "Tukusanyukidde! Nnyinza kukuyamba ku:\n1. Okukola akawunti y'oguzibwa\n2. Okuzuula abalimi\n3. Okuteeka ebiragiro\n4. Engeri z'okusasula\n5. Okulondoola okutwala ebintu",
    placeholder: "Wandika obubaka...",
    send: "Sindika",
    minimize: "Kendeeza",
    newChat: "Obubaka Bupya",
    typing: "ShambaNi Assistant ali mu kiwandiiko...",
    connectAgent: "Yunga ne Muntu",
    whatsappFallback: "Bubaka ku WhatsApp",
    languageSelect: "Lulimi:",
    categories: {
      registration: "Okwewandiisa",
      listing: "Okuteeka ku Mboli",
      orders: "Ebiragiro n'Okutwala",
      payments: "Ensimbi",
      verification: "Okukakasa",
      complaints: "Eby'okunenya"
    }
  },
  sw: {
    greeting: "Habari! Mimi ni Msaidizi wa ShambaNi. Ninaweza kukusaidia vipi leo?",
    farmerPrompt: "Wewe ni mkulima au mnunuzi?",
    farmerHelp: "Vizuri! Ninaweza kukusaidia na:\n1. Usajili wa shamba lako\n2. Kuweka mazao yako\n3. Kuthibitisha akaunti yako\n4. Maswali ya malipo\n5. Usafirishaji",
    buyerHelp: "Karibu! Ninaweza kukusaidia na:\n1. Kuunda akaunti ya mnunuzi\n2. Kutafuta wakulima\n3. Kuweka maagizo\n4. Chaguo za malipo\n5. Ufuatiliaji wa usafirishaji",
    placeholder: "Andika ujumbe...",
    send: "Tuma",
    minimize: "Punguza",
    newChat: "Mazungumzo Mapya",
    typing: "Msaidizi wa ShambaNi anaandika...",
    connectAgent: "Unganisha na Mtu",
    whatsappFallback: "Zungumza kwa WhatsApp",
    languageSelect: "Lugha:",
    categories: {
      registration: "Usajili",
      listing: "Kuweka Mazao",
      orders: "Maagizo na Usafirishaji",
      payments: "Malipo",
      verification: "Uthibitishaji",
      complaints: "Malalamiko"
    }
  }
};

// Knowledge base responses
const KNOWLEDGE_BASE = {
  en: {
    'register': "To register as a farmer:\n1. Visit shambani-market.africa\n2. Click 'List Your Farm'\n3. Fill your profile with photo and NIRA ID\n4. Add your farm details\n5. Wait for verification (usually 24-48 hours)",
    'buyer register': "To register as a buyer:\n1. Visit shambani-market.africa\n2. Click 'Sign In' then 'Register as Buyer'\n3. Choose your type: School, Hospital, Restaurant, Hotel, or Individual\n4. Fill organization details\n5. Verify your email/phone",
    'payment': "ShambaNi accepts:\n- MTN Mobile Money\n- Airtel Money\n- PayPal (for international buyers)\n- Bank transfer (for institutional buyers)",
    'commission': "ShambaNi charges only 2.5% per transaction. This is much lower than traditional middlemen who take 30-40%.",
    'ussd': "Dial *220# on any phone to access ShambaNi via USSD. No smartphone needed! You can list produce, check orders, and receive payments.",
    'verify': "Verification requires:\n- Profile photo\n- NIRA ID document photo\n- Mobile money registered in your name\nOur admin team reviews within 24-48 hours.",
    'delivery': "Delivery is arranged directly between farmer and buyer. ShambaNi provides verified contact details. For bulk orders, we can connect you with local logistics partners.",
    'price': "Farmers set their own prices on ShambaNi. Buyers can compare prices from multiple farmers and negotiate directly.",
    'school': "Schools can register as institutional buyers to purchase fresh produce directly from verified farmers. Contact us for bulk pricing and scheduled delivery arrangements.",
    'hospital': "Hospitals can register as institutional buyers to source fresh, quality-assured produce from verified farmers. We support HACCP-compliant suppliers.",
    'help': "I can help with:\n- Farmer/buyer registration\n- Listing produce\n- Orders and delivery\n- Payment methods\n- Account verification\n- Technical issues\n\nWhat do you need help with?"
  },
  lg: {
    'register': "Okwewandiisa ng'omulimi:\n1. Genda ku shambani-market.africa\n2. Koona 'List Your Farm'\n3. Jjawo ebikwatako ne foto ne NIRA ID\n4. Ggatako ebikwata ku kyalo kyo\n5. Lindirira okukakasibwa (enkola 24-48)",
    'buyer register': "Okwewandiisa ng'omuguzi:\n1. Genda ku shambani-market.africa\n2. Koona 'Sign In' olwo 'Register as Buyer'\n3. Londako ekika kyo: Essomero, eddwaliro, eky'okulya, hoteli, oba omuntu\n4. Jjawo ebikwata ku kitebe\n5. Kakasa email/essimu yo",
    'payment': "ShambaNi ekkiriza:\n- MTN Mobile Money\n- Airtel Money\n- PayPal (abaguzi ab'awaka)\n- Okusindika mu banki (abaguzi ab'ebitebe)",
    'commission': "ShambaNi etta 2.5% ku buli musango. Eno ntono nnyo okusinga abazibisa abatwala 30-40%.",
    'ussd': "Dya *220# ku ffoni yonna okweyambisa ShambaNi mu USSD. Tekyetaaga smartphone! Osobola okuteeka ebintu, okulaba ebiragiro, n'okufuna ssente.",
    'verify': "Okukakasa kyetaaga:\n- Foto yo\n- Foto ya NIRA ID yo\n- Mobile money erinnya lyo\nAbakulu baffe bakola mu maaso ga 24-48.",
    'delivery': "Okutwala ebintu kutegekebwa wakati w'omulimi n'omuguzi. ShambaNi ewabba obubaka obukakasiddwa. Ku biragiro ebingi, tuyinza okukuyungako n'abakola okutwala ebintu.",
    'price': "Abalimi beetegeka ebbeeyi zaabwe ku ShambaNi. Abaguzi basobola okugerageranya ebbeeyi okuva ku balimi ab'enjawulo n'okuteesa ku butereevu.",
    'school': "Amasomero gasobola okwewandiisa ng'abaguzi ab'ebitebe okugula ebintu ebirungi okuva ku balimi abakakasiddwa. Tukwatagane ku bbeeyi ez'obungi n'okutwala ebintu.",
    'hospital': "Eddwaliro lisobola okwewandiisa okufuna ebintu ebirungi okuva ku balimi abakakasiddwa. Tuyamba n'abakola ebintu ebituukana ne HACCP.",
    'help': "Nnyinza kukuyamba ku:\n- Okwewandiisa kw'omulimi/omuguzi\n- Okuteeka ebintu ku mboli\n- Ebiragiro n'okutwala\n- Engeri z'okusasula\n- Okukakasa akawunti\n- Ebizibu ebyenjawulo\n\nOnyagala buyambi ki?"
  },
  sw: {
    'register': "Kujiandikisha kama mkulima:\n1. Tembelea shambani-market.africa\n2. Bofya 'List Your Farm'\n3. Jaza wasifu wako na picha na NIRA ID\n4. Ongeza maelezo ya shamba lako\n5. Subiri uthibitisho (kawaida masaa 24-48)",
    'buyer register': "Kujiandikisha kama mnunuzi:\n1. Tembelea shambani-market.africa\n2. Bofya 'Sign In' kisha 'Register as Buyer'\n3. Chagua aina yako: Shule, Hospitali, Mkahawa, Hoteli, au Mtu\n4. Jaza maelezo ya shirika\n5. Thibitisha barua pepe/simu yako",
    'payment': "ShambaNi inakubali:\n- MTN Mobile Money\n- Airtel Money\n- PayPal (kwa wanunuzi wa kimataifa)\n- Uhamisho wa benki (kwa wanunuzi wa taasisi)",
    'commission': "ShambaNi inachaji 2.5% tu kwa kila muamala. Hii ni chini sana ukilinganisha na wafanyabiashara wa kienyeji wanaochukua 30-40%.",
    'ussd': "Piga *220# kwenye simu yoyote kufikia ShambaNi kupitia USSD. Hahitaji smartphone! Unaweza kuweka mazao, angalia maagizo, na kupokea malipo.",
    'verify': "Uthibitishaji unahitaji:\n- Picha ya wasifu\n- Picha ya hati ya NIRA ID\n- Mobile money iliyosajiliwa kwa jina lako\nWafanyakazi wetu wanagalia ndani ya masaa 24-48.",
    'delivery': "Usafirishaji unapangwa moja kwa moja kati ya mkulima na mnunuzi. ShambaNi inatoa maelezo yaliyothibitishwa ya mawasiliano. Kwa maagizo ya jumla, tunaweza kukuunganisha na washirika wa usafirishaji.",
    'price': "Wakulima wanaweka bei zao wenyewe kwenye ShambaNi. Wanunuzi wanaweza kulinganisha bei kutoka kwa wakulima wengi na kupiga mswapo moja kwa moja.",
    'school': "Shule zinaweza kujiandikisha kama wanunuzi wa kitaasisi kununua mazao moja kwa moja kutoka kwa wakulima waliohalalishwa. Wasiliana nasi kwa bei za jumla na upangaji wa usafirishaji.",
    'hospital': "Hospitali zinaweza kujiandikisha kama wanunuzi wa kitaasisi kupata mazao mazuri kutoka kwa wakulima waliohalalishwa. Tunasaidia wasambazaji wanaofuata HACCP.",
    'help': "Ninaweza kukusaidia na:\n- Usajili wa mkulima/mnunuzi\n- Kuweka mazao\n- Maagizo na usafirishaji\n- Njia za malipo\n- Uthibitishaji wa akaunti\n- Masuala ya kiufundi\n\nUnahitaji msaada wa nini?"
  }
};

// Simple keyword matching for responses
function getResponse(message, lang, userType) {
  const lowerMsg = message.toLowerCase();
  const kb = KNOWLEDGE_BASE[lang] || KNOWLEDGE_BASE.en;
  
  if (lowerMsg.includes('register') || lowerMsg.includes('wandiisa') || lowerMsg.includes('jiandikisha') || lowerMsg.includes('sign up')) {
    return userType === 'buyer' ? kb['buyer register'] : kb['register'];
  }
  if (lowerMsg.includes('payment') || lowerMsg.includes('ssente') || lowerMsg.includes('malipo') || lowerMsg.includes('money') || lowerMsg.includes('pay')) {
    return kb['payment'];
  }
  if (lowerMsg.includes('commission') || lowerMsg.includes('fee') || lowerMsg.includes('charge') || lowerMsg.includes('tta') || lowerMsg.includes('chaji')) {
    return kb['commission'];
  }
  if (lowerMsg.includes('ussd') || lowerMsg.includes('*220#') || lowerMsg.includes('phone') || lowerMsg.includes('simu')) {
    return kb['ussd'];
  }
  if (lowerMsg.includes('verify') || lowerMsg.includes('kakasa') || lowerMsg.includes('thibitisha') || lowerMsg.includes('id')) {
    return kb['verify'];
  }
  if (lowerMsg.includes('deliver') || lowerMsg.includes('twala') || lowerMsg.includes('safirisha') || lowerMsg.includes('transport')) {
    return kb['delivery'];
  }
  if (lowerMsg.includes('price') || lowerMsg.includes('bbeeyi') || lowerMsg.includes('bei') || lowerMsg.includes('cost')) {
    return kb['price'];
  }
  if (lowerMsg.includes('school') || lowerMsg.includes('somero') || lowerMsg.includes('shule')) {
    return kb['school'];
  }
  if (lowerMsg.includes('hospital') || lowerMsg.includes('ddwaliro') || lowerMsg.includes('hospitali')) {
    return kb['hospital'];
  }
  if (lowerMsg.includes('help') || lowerMsg.includes('yamba') || lowerMsg.includes('saidia') || lowerMsg.includes('support')) {
    return kb['help'];
  }
  if (lowerMsg.includes('farmer') || lowerMsg.includes('mulimi') || lowerMsg.includes('mkulima')) {
    return kb['farmerHelp'] || kb['register'];
  }
  if (lowerMsg.includes('buyer') || lowerMsg.includes('muguzi') || lowerMsg.includes('mnunuzi')) {
    return kb['buyerHelp'] || kb['buyer register'];
  }
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('habari') || lowerMsg.includes('oli otya')) {
    return TRANSLATIONS[lang].greeting + '\n\n' + TRANSLATIONS[lang].farmerPrompt;
  }
  
  // Default response
  const defaults = {
    en: "I'm not sure I understand. You can ask me about:\n- How to register\n- Payment methods\n- Delivery\n- Prices\n- Account verification\n- USSD (*220#)\n\nOr type 'help' for all options.",
    lg: "Sitetegedde bulungi. Osobola okunzibua ku:\n- Okwewandiisa\n- Engeri z'okusasula\n- Okutwala ebintu\n- Ebbeeyi\n- Okukakasa akawunti\n- USSD (*220#)\n\nOba wandika 'help' okulaba ebintu byonna.",
    sw: "Sifahamu vizuri. Unaweza kuniuliza kuhusu:\n- Usajili\n- Njia za malipo\n- Usafirishaji\n- Bei\n- Uthibitishaji wa akaunti\n- USSD (*220#)\n\nAu andika 'help' kwa chaguzi zote."
  };
  return defaults[lang] || defaults.en;
}

export default function ShambaNiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [language, setLanguage] = useState('en');
  const [userType, setUserType] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const t = TRANSLATIONS[language];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Send initial greeting on first open
  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      addBotMessage(t.greeting + '\n\n' + t.farmerPrompt);
    }
  };

  const addBotMessage = (text) => {
    setIsTyping(true);
    // Simulate typing delay
    const delay = Math.min(1000 + text.length * 15, 3000);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text, timestamp: new Date() }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
    setInputText('');

    // Detect user type from message
    const lowerMsg = userMsg.toLowerCase();
    if (!userType) {
      if (lowerMsg.includes('farmer') || lowerMsg.includes('mulimi') || lowerMsg.includes('mkulima') || lowerMsg.includes('farm')) {
        setUserType('farmer');
        addBotMessage(t.farmerHelp);
        return;
      }
      if (lowerMsg.includes('buyer') || lowerMsg.includes('muguzi') || lowerMsg.includes('mnunuzi') || lowerMsg.includes('school') || lowerMsg.includes('hospital') || lowerMsg.includes('restaurant') || lowerMsg.includes('hotel')) {
        setUserType('buyer');
        addBotMessage(t.buyerHelp);
        return;
      }
    }

    // Get response from knowledge base
    const response = getResponse(userMsg, language, userType);
    addBotMessage(response);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setUserType(null);
    addBotMessage(t.greeting + '\n\n' + t.farmerPrompt);
  };

  const handleWhatsAppFallback = () => {
    const phone = '256708813419';
    const text = encodeURIComponent('Hello ShambaNi, I need assistance with the marketplace.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  // Quick action buttons
  const quickActions = [
    { key: 'register', label: t.categories.registration },
    { key: 'payment', label: t.categories.payments },
    { key: 'orders', label: t.categories.orders },
    { key: 'help', label: 'Help / Buyambi / Msaada' }
  ];

  return (
    <div className="shambani-chatbot">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button 
          className="chatbot-toggle-btn" 
          onClick={handleOpen}
          aria-label="Open chat"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="chatbot-label">Ask ShambaNi</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div>
                <div className="chatbot-title">ShambaNi Assistant</div>
                <div className="chatbot-status">
                  <span className="status-dot online"></span>
                  Online
                </div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button onClick={handleNewChat} className="header-btn" title={t.newChat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12h18M12 3v18"/>
                </svg>
              </button>
              <button onClick={() => setIsOpen(false)} className="header-btn" title={t.minimize}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="chatbot-language-bar">
            <span>{t.languageSelect}</span>
            {['en', 'lg', 'sw'].map(lang => (
              <button
                key={lang}
                className={`lang-btn ${language === lang ? 'active' : ''}`}
                onClick={() => setLanguage(lang)}
              >
                {lang === 'en' ? 'English' : lang === 'lg' ? 'Luganda' : 'Swahili'}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="message-avatar bot">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                )}
                <div className="message-bubble">
                  <div className="message-text">
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>{line}<br/></span>
                    ))}
                  </div>
                  <div className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing-indicator">
                <div className="message-avatar bot">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div className="message-bubble">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length > 0 && (
            <div className="chatbot-quick-actions">
              {quickActions.map(action => (
                <button
                  key={action.key}
                  className="quick-action-btn"
                  onClick={() => {
                    setInputText(action.label);
                    inputRef.current?.focus();
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-area">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.placeholder}
              rows={1}
              className="chatbot-input"
            />
            <button onClick={handleSend} className="chatbot-send-btn" aria-label={t.send}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="chatbot-footer">
            <button onClick={handleWhatsAppFallback} className="footer-action whatsapp">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.whatsappFallback}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
