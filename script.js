// public/script.js
const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function displayUserMessage(message) {
    const container = document.createElement('div');
    container.classList.add('message-container', 'user-message');
    
    const content = document.createElement('div');
    content.classList.add('message-content');
    content.textContent = message;

    container.appendChild(content);
    chatDisplay.appendChild(container);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

function displayBotMessage(message) {
    const container = document.createElement('div');
    container.classList.add('message-container', 'bot-message');

    const content = document.createElement('div');
    content.classList.add('message-content');
    container.appendChild(content);
    chatDisplay.appendChild(container);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    const words = message.split(' ');
    let currentIndex = 0;

    const intervalId = setInterval(() => {
        if (currentIndex < words.length) {
            content.textContent += `${words[currentIndex]} `;
            currentIndex++;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        } else {
            clearInterval(intervalId);
        }
    }, 200);
}

function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage !== '') {
        displayUserMessage(`You: ${userMessage}`);
        userInput.value = '';

        simulateTyping();
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            const botResponse = data.botResponse;
            setTimeout(() => {
                displayBotMessage(`${botResponse}`);
            }, 1000); // Simulating response delay
        })
        .catch(error => console.error('Error:', error));
    }
}

function simulateTyping() {
    sendButton.disabled = true;
    const typingIndicator = document.createElement('div');

    typingIndicator.classList.add('message-container', 'bot-message');
    chatDisplay.appendChild(typingIndicator);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;

    setTimeout(() => {
        chatDisplay.removeChild(typingIndicator);
        sendButton.disabled = false;
    }, 0); // Simulating typing delay
}

userInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
