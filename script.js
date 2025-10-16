// API URL (Railway backend)
const API_URL = 'https://vivo-production-6e4c.up.railway.app';

// Utility to add chat messages
function addMessage(content, sender) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'message ' + sender;
    if (sender === 'ai' && content.startsWith('data:image')) {
        const img = document.createElement('img');
        img.src = content;
        div.appendChild(img);
    } else {
        div.textContent = content;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

// Handle Chat AI form
function setupChatForm() {
    const form = document.getElementById('aiForm');
    const loader = document.getElementById('loader');
    if(!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const userText = formData.get('prompt');
        if(!userText) return;

        addMessage(userText, 'user');
        loader.style.display = 'block';

        try {
            const res = await fetch(API_URL + '/process', { method: 'POST', body: formData });
            const data = await res.json();
            addMessage(data.result, 'ai');
        } catch (err) {
            addMessage('Error: ' + err.message, 'ai');
        } finally {
            loader.style.display = 'none';
            form.reset();
        }
    }
}

// Handle Train AI form
function setupTrainForm() {
    const form = document.getElementById('trainForm');
    const loader = document.getElementById('trainLoader');
    if(!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        loader.style.display = 'block';

        try {
            const res = await fetch(API_URL + '/train', { method: 'POST', body: formData });
            const data = await res.json();
            alert('Training Started: ' + JSON.stringify(data));
        } catch(err) {
            alert('Error: ' + err.message);
        } finally {
            loader.style.display = 'none';
            form.reset();
        }
    }
}

// Setup navigation highlighting
function setupNav() {
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        if(link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupChatForm();
    setupTrainForm();
});
