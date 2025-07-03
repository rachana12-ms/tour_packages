import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VoiceChatbox.css';

const VoiceChatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null);

  const getBotReply = (msg) => {
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
      return "Hello! 👋 I'm your Travel Assistant. How can I help you today?";
    }
    if (msg.includes("book") || msg.includes("booking")) {
      return "To book a tour package, click 'Book Now' on any package or go to the Bookings section.";
    }
    if (msg.includes("package") || msg.includes("packages") || msg.includes("tour")) {
      return "We offer Heritage Tours, Hill Station Retreats, Wildlife Adventures, and more!";
    }
    if (msg.includes("price") || msg.includes("cost")) {
      return "Prices vary by destination. You can filter packages by price in the Filter section.";
    }
    if (msg.includes("duration") || msg.includes("days")) {
      return "Our packages range from 3 to 15 days. Filter them based on your preference.";
    }
    if (msg.includes("contact") || msg.includes("support") || msg.includes("help")) {
      return "You can contact our support at 📞 +91-98765-43210 or use the Contact section.";
    }
    if (msg.includes("location") || msg.includes("where")) {
      return "We offer travel packages to Goa, Manali, Kerala, Rajasthan, Andaman, and more.";
    }
    if (msg.includes("refund") || msg.includes("cancel")) {
      return "You can cancel a booking from the Bookings section. Refunds are processed in 3-5 business days.";
    }
    if (msg.includes("offer") || msg.includes("discount")) {
      return "🎉 We're currently offering 10% off on bookings above ₹25,000!";
    }
    if (msg.includes("thank")) {
      return "You're welcome! 😊 Safe travels!";
    }

    return "I'm not sure I understand. You can ask about packages, bookings, prices, or support.";
  };

  const handleSend = useCallback((textFromVoice = null) => {
    const userMsg = textFromVoice || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);

    const botReply = getBotReply(userMsg.toLowerCase());
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botReply, sender: 'bot' }]);
    }, 700);

    setInput('');
  }, [input]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setRecognizing(true);
      recognition.onend = () => setRecognizing(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript); // auto-send on recognition result
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, [handleSend]);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (recognition && !recognizing) {
      try {
        recognition.start();
      } catch (err) {
        console.error("Mic start error:", err.message);
      }
    }
  };

  return (
    <div className="voice-chatbox">
      <div className="chat-header">TravelBot</div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>{msg.text}</div>
        ))}
        {recognizing && <div className="msg bot">🎤 Listening...</div>}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message or use the mic..."
        />
        <button onClick={handleMicClick}>🎤</button>
        <button onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
};

export default VoiceChatbox;
