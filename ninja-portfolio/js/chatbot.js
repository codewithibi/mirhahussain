// Groq API Integration
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // For security reasons, don't hardcode the API key
    // The API key will be entered by the user or stored server-side in production
    let apiKey = '';
    
    // Model to use
    const model = 'llama3-70b-8192';
    
    // Initialize chat history with system message
    let chatHistory = [
        {
            role: 'system',
            content: 'You are a helpful AI assistant named Ninja AI. You are knowledgeable, friendly, and concise in your responses. You help users with information about martial arts, technology, digital art, and other topics. Always maintain a positive and encouraging tone.'
        }
    ];

    // Function to update UI based on API key status
    function updateApiKeyStatus() {
        const infoBanner = document.querySelector('.info-banner');
        
        if (apiKey) {
            if (infoBanner) {
                infoBanner.classList.add('key-set');
                const statusMsg = document.createElement('p');
                statusMsg.innerHTML = '<i class="fas fa-check-circle"></i> API key is set! You can now chat with the AI.';
                statusMsg.className = 'key-status';
                
                // Remove any existing status message
                const existingStatus = infoBanner.querySelector('.key-status');
                if (existingStatus) {
                    existingStatus.remove();
                }
                
                infoBanner.appendChild(statusMsg);
            }
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
    
    // Check if API key is stored in session
    if (sessionStorage.getItem('groq_api_key')) {
        apiKey = sessionStorage.getItem('groq_api_key');
        // Show a message that API key is set
        addMessage('API key is set. You can start chatting!', false);
        updateApiKeyStatus();
    } else {
        // Show message asking for API key
        addMessage('Hello! I\'m your Ninja AI Assistant powered by Groq.', false);
        addMessage('Please enter your Groq API key to start chatting.', false);
        addMessage('Type "/key YOUR_API_KEY" to set your API key.', false);
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
    
    // Function to handle API key commands
    function handleCommand(message) {
        if (message.startsWith('/key ')) {
            const key = message.substring(5).trim();
            if (key) {
                // Store API key in session storage (not visible in code)
                sessionStorage.setItem('groq_api_key', key);
                apiKey = key;
                addMessage('API key set successfully! You can now chat with the Ninja AI.', false);
                updateApiKeyStatus();
                return true;
            }
        } else if (message === '/clear') {
            // Clear the chat history except for system message
            chatHistory = [chatHistory[0]];
            // Clear the chat messages UI
            while (chatMessages.firstChild) {
                chatMessages.removeChild(chatMessages.firstChild);
            }
            addMessage('Chat history cleared!', false);
            return true;
        } else if (message === '/help') {
            addMessage('Available commands:', false);
            addMessage('/key YOUR_API_KEY - Set your Groq API key', false);
            addMessage('/clear - Clear chat history', false);
            addMessage('/help - Show this help message', false);
            return true;
        }
        return false;
    }
    
    // Function to send message to Groq API
    async function sendMessageToGroq(userMessage) {
        try {
            // Check if API key is set
            if (!apiKey) {
                addMessage('Please set your API key first using "/key YOUR_API_KEY"', false);
                return;
            }
            
            // Add user message to chat history
            chatHistory.push({
                role: 'user',
                content: userMessage
            });
            
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.error?.message || 
                    `HTTP error! Status: ${response.status}`
                );
            }
            
            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;
            
            // Add assistant message to chat history
            chatHistory.push({
                role: 'assistant',
                content: assistantMessage
            });
            
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
            }
            
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            
            // More specific error messages
            if (error.message.includes('invalid_api_key')) {
                addMessage('Error: Invalid API key. Please check your API key and try again.', false);
            } else if (error.message.includes('rate_limit_exceeded')) {
                addMessage('Error: Rate limit exceeded. Please try again later.', false);
            } else {
                addMessage(`Error: ${error.message || 'Something went wrong. Please try again.'}`, false);
            }
        }
    }
    
    // Event listener for send button
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            
            // Check if it's a command
            if (!handleCommand(message)) {
                sendMessageToGroq(message);
            }
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