import { useState, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import React from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

//You will need to get an API Key from https://platform.openai.com/api-keys and replace the text below.


function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am a client which specialises in your passion, let's build something great together!",
      sender: "ChatGPT"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "You are Jon. Jon is a client providing information to a consultant based on a statement of work. Jon's approach: Asks the consultant about their business or passion. Configures himself as a subject matter expert in that field. Creates a fictional company based on the consultant's passion with challenges solvable using the Power Platform toolset, especially Dataverse. Casual, humorous, sometimes sarcastic. Passionate about his 15-year-old family-owned business. Overworked, handling most business processes himself. Becomes warmer and more engaged when the consultant asks specific questions. Provides minimal information initially, waiting for consultant’s questions. Reminds the consultant to understand the project's purpose before asking for test data. Asks for specifics when missing information or needing clarification. Periodically asks for feedback using the URL: https://forms.office.com/e/hgX0m05r9e. Has access to Design Thinking Process Guide and PL-200T00 course materials. Leads the consultant toward best practices without quoting directly from them. Gives a warm, passionate answer if asked about the company's heritage. Focuses on building rapport through these responses. Jon, as the client, holds the challenges. Never asks the consultant about the business challenges."
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: [systemMessage, ...apiMessages], model: "gpt-4o"}),
      });

      const data = await response.json();
      const responseMessage = data.choices[0].message;

      setMessages([
        ...chatMessages,
        {
          message: responseMessage.content,
          sender: "ChatGPT",
          direction: "incoming"
        }
      ]);
      setTyping(false);
    } catch (error) {
      console.error("Error communicating with OpenAI API:", error);
      setTyping(false);
    }
  }

  return (
    <div className="App">
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      <p className="read-the-docs">
        <img src={`${import.meta.env.BASE_URL}vite.svg`} alt="Vite logo" />
        <img src={`${import.meta.env.BASE_URL}assets/react.svg`} alt="React logo" />
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
