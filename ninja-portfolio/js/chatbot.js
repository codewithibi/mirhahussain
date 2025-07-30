// Groq API Integration
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Model to use
    const model = 'llama3-70b-8192';
    
    // Get API key from localStorage or prompt user
    let apiKey = localStorage.getItem('groqApiKey');
    
    // Initialize chat history with system message or load from localStorage
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [
        {
            role: 'system',
            content: 'You are a helpful AI assistant named Ninja AI. You are knowledgeable, friendly, and concise in your responses. You help users with information about martial arts, technology, digital art, and other topics. Always maintain a positive and encouraging tone.'
        }
    ];
    
    // Load saved messages into UI
    function loadSavedMessages() {
        chatMessages.innerHTML = ''; // Clear existing messages
        chatHistory.forEach(message => {
            if (message.role !== 'system') {
                addMessage(message.content, message.role === 'user');
            }
        });
    }
    
    // Check if there are saved messages and load them
    if (chatHistory.length > 1) {
        loadSavedMessages();
    }
    
    // Function to prompt for API key
    function promptForApiKey() {
        const key = prompt('Please enter your Groq API key to use the chatbot:');
        if (key && key.trim()) {
            apiKey = key.trim();
            localStorage.setItem('groqApiKey', apiKey);
            return true;
        }
        return false;
    }
    
    // Function to change API key
    function changeApiKey() {
        if (promptForApiKey()) {
            addMessage('API key updated successfully!', false);
        } else {
            addMessage('API key update cancelled or empty key provided.', false);
        }
    }
    
    // Add API key button to the UI
    function setupApiKeyButton() {
        const apiKeyButton = document.createElement('button');
        apiKeyButton.id = 'apiKeyButton';
        apiKeyButton.textContent = 'Change API Key';
        apiKeyButton.className = 'api-key-button';
        apiKeyButton.addEventListener('click', changeApiKey);
        
        // Add button near the chat interface
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.parentNode.insertBefore(apiKeyButton, chatContainer);
        } else {
            // Fallback - add before chat messages
            chatMessages.parentNode.insertBefore(apiKeyButton, chatMessages);
        }
    }
    
    // Setup API key button
    setupApiKeyButton();
    
    // Check for API key on startup
    if (!apiKey) {
        if (!promptForApiKey()) {
            addMessage('Please provide a Groq API key to use the chatbot. Click "Change API Key" button to set it.', false);
        }
    }
    
    // Function to add messages to the UI
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageParagraph = document.createElement('p');
        messageParagraph.textContent = content;
        
        messageContent.appendChild(messageParagraph);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.id = 'typing-indicator';
        
        const typingContent = document.createElement('div');
        typingContent.className = 'message-content';
        
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        
        typingContent.appendChild(typingIndicator);
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to save chat history to localStorage
    function saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    
    // Function to send message to Groq API
    async function sendMessageToGroq(userMessage) {
        if (!apiKey) {
            addMessage('No API key provided. Please click "Change API Key" button to set your Groq API key.', false);
            return;
        }
        
        try {
            // Add user message to chat history
            chatHistory.push({
                role: 'user',
                content: userMessage
            });
            
            // Save chat history
            saveChatHistory();
            
            // Show typing indicator while waiting for response
            showTypingIndicator();
            
            // Make API request to Groq
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: chatHistory,
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;
            
            // Add assistant message to chat history
            chatHistory.push({
                role: 'assistant',
                content: assistantMessage
            });
            
            // Save updated chat history
            saveChatHistory();
            
            // Remove typing indicator and display assistant message
            removeTypingIndicator();
            addMessage(assistantMessage, false);
            
            // Keep chat history to a reasonable size
            if (chatHistory.length > 10) {
                // Keep system message and last 9 messages
                chatHistory = [
                    chatHistory[0],
                    ...chatHistory.slice(chatHistory.length - 9)
                ];
                saveChatHistory();
            }
            
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessage('Sorry, I encountered an error. Please check your API key and try again.', false);
        }
    }
    
    // Function to clear chat history
    function clearChatHistory() {
        // Keep only system message
        chatHistory = [chatHistory[0]];
        saveChatHistory();
        chatMessages.innerHTML = '';
        addMessage('Chat history cleared.', false);
    }
    
    // Add clear history button
    function setupClearHistoryButton() {
        const clearButton = document.createElement('button');
        clearButton.id = 'clearHistoryButton';
        clearButton.textContent = 'Clear History';
        clearButton.className = 'clear-history-button';
        clearButton.addEventListener('click', clearChatHistory);
        
        const apiKeyButton = document.getElementById('apiKeyButton');
        if (apiKeyButton) {
            apiKeyButton.parentNode.insertBefore(clearButton, apiKeyButton.nextSibling);
        }
    }
    
    // Setup clear history button
    setupClearHistoryButton();
    
    // Event listener for send button
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            sendMessageToGroq(message);
        }
    });
    
    // Event listener for Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
}); 