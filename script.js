// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    databaseURL: "SUA_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};
firebase.initializeApp(firebaseConfig);

// Função para enviar mensagens ao chat
function sendMessage(message) {
    firebase.database().ref('messages/').push({ message });
}

// Exibir mensagens do chat em tempo real
firebase.database().ref('messages/').on('value', (snapshot) => {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';
    snapshot.forEach((msg) => {
        chatBox.innerHTML += `<p>${msg.val().message}</p>`;
    });
});





async function analyzeSentiment(messages) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer SUA_API_KEY`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: messages }],
            max_tokens: 100
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

// Exemplo de chamada para analisar as mensagens do chat
firebase.database().ref('messages/').once('value', (snapshot) => {
    let allMessages = '';
    snapshot.forEach((msg) => {
        allMessages += msg.val().message + ' ';
    });
    analyzeSentiment(allMessages).then(sentiment => console.log("Sentimento da reunião:", sentiment));
});
