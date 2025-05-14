document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const messagesContainer = document.getElementById('messages-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const levelOptions = document.querySelectorAll('.level-option');
    const modal = document.getElementById('resource-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    
    // Current user level
    let currentLevel = 'basico';
    
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
      if (this.scrollHeight > 120) {
        this.style.overflowY = 'auto';
      } else {
        this.style.overflowY = 'hidden';
      }
    });
    
    // Handle level selection
    levelOptions.forEach(option => {
      option.addEventListener('click', function() {
        levelOptions.forEach(o => o.classList.remove('active'));
        this.classList.add('active');
        currentLevel = this.dataset.level;
        
        // Add a message about changing the level
        const levelMessages = {
          'basico': 'Nivel cambiado a Básico. Te explicaré los conceptos de manera sencilla y accesible.',
          'intermedio': 'Nivel cambiado a Intermedio. Profundizaré un poco más en los detalles y funcionalidades.',
          'avanzado': 'Nivel cambiado a Avanzado. Te proporcionaré información detallada y técnica sobre las herramientas.'
        };
        
        addBotMessage(levelMessages[currentLevel]);
      });
    });
    
    // Send message function
    function sendMessage() {
      const message = userInput.value.trim();
      if (message === '') return;
      
      // Add user message to chat
      addUserMessage(message);
      
      // Clear input
      userInput.value = '';
      userInput.style.height = 'auto';
      
      // Show loading indicator
      sendButton.style.display = 'none';
      loadingIndicator.style.display = 'block';
      
      // Show typing indicator
      showTypingIndicator();
      
      // Call the API with the user's message and current level
      fetchResponse(message, currentLevel)
        .then(response => {
          // Hide typing indicator
          hideTypingIndicator();
          
          // Add bot response to chat
          addBotMessage(response);
          
          // Hide loading indicator
          loadingIndicator.style.display = 'none';
          sendButton.style.display = 'flex';
          
          // Scroll to bottom
          scrollToBottom();
        })
        .catch(error => {
          // Hide typing indicator
          hideTypingIndicator();
          
          // Show error message
          addBotMessage(`Lo siento, ha ocurrido un error: ${error.message}`);
          
          // Hide loading indicator
          loadingIndicator.style.display = 'none';
          sendButton.style.display = 'flex';
          
          // Scroll to bottom
          scrollToBottom();
        });
    }
    
    // Fetch response from API
    async function fetchResponse(message, level) {
      try {
        // Encode the message for URL
        const encodedMessage = encodeURIComponent(message);
        const apiUrl = `http://127.0.0.1:30001/ask/${level}/${encodedMessage}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
    
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Return the response content
        return data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    }
    
    // Show typing indicator
    function showTypingIndicator() {
      const typingIndicator = document.createElement('div');
      typingIndicator.id = 'typing';
      typingIndicator.className = 'bot-message typing-indicator';
      typingIndicator.innerHTML = '<span></span><span></span><span></span>';
      messagesContainer.appendChild(typingIndicator);
      scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
      const typingIndicator = document.getElementById('typing');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }
    
    // Add user message to chat
    function addUserMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'user-message';
      messageElement.textContent = message;
      messagesContainer.appendChild(messageElement);
      scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
      const messageElement = document.createElement('div');
      messageElement.className = 'bot-message';
      messageElement.innerHTML = message;
      messagesContainer.appendChild(messageElement);
      
      // Add click events to resource cards
      const resourceCards = messageElement.querySelectorAll('.resource-card');
      resourceCards.forEach(card => {
        card.addEventListener('click', function() {
          const title = this.querySelector('h3').textContent;
          const content = this.dataset.content;
          openResourceModal(title, content);
        });
      });
      
      scrollToBottom();
    }
    
    // Scroll to bottom of messages
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Open resource modal
    function openResourceModal(title, content) {
      modalTitle.textContent = title;
      modalBody.innerHTML = content;
      modal.style.display = 'flex';
    }
    
    // Close resource modal
    closeModal.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
    
    // Send message on Enter key (without Shift)
    userInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
});