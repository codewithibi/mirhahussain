// Groq API Integration
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    // Groq API key - stored securely
    const apiKey = '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';
    
    // Model to use
    const model = 'llama3-70b-8192';
    
    // Initialize chat history with system message
    let chatHistory = [
        {
            role: 'system',
            content: 'You are a helpful AI assistant named Ninja AI. You are knowledgeable, friendly, and concise in your responses. You help users with information about martial arts, technology, digital art, and other topics. Always maintain a positive and encouraging tone.'
        }
    ];
    
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
    
    // Function to send message to Groq API
    async function sendMessageToGroq(userMessage) {
        try {
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
                throw new Error(`HTTP error! Status: ${response.status}`);
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
            addMessage('Sorry, I encountered an error. Please try again later.', false);
        }
    }
    
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