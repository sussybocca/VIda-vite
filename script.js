const API_URL = 'https://vivo-production-6e4c.up.railway.app/';

function addMessage(content, sender) {
    const outputBox = document.getElementById('output-box');
    const msg = document.createElement('p');
    msg.className = sender + '-message';
    
    if (sender === 'ai' && content.startsWith('data:image')) {
        const img = document.createElement('img');
        img.src = content;
        msg.appendChild(img);
    } else {
        msg.textContent = content;
    }

    outputBox.appendChild(msg);
    outputBox.scrollTop = outputBox.scrollHeight;
}

function setupChatForm() {
    const form = document.getElementById('aiForm');
    const loader = document.getElementById('loader');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const userText = formData.get('prompt');
        if (!userText) return;

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

document.addEventListener('DOMContentLoaded', () => {
    setupChatForm();
});
