(function () {
  // Récupérer les attributs passés dans <script ...>
  const scriptTag = document.currentScript;
  const endpoint = scriptTag.getAttribute("data-endpoint");
  const title = scriptTag.getAttribute("data-title") || "Chatbot";
  const color = scriptTag.getAttribute("data-color") || "#191970";
  const position = scriptTag.getAttribute("data-position") || "right";
  const bubbleText = scriptTag.getAttribute("data-bubble-text") || "💬";
  const greet = scriptTag.getAttribute("data-greet") || "Bonjour 👋";

  // Créer la bulle de chat
  const bubble = document.createElement("div");
  bubble.innerText = bubbleText;
  bubble.style.position = "fixed";
  bubble.style.bottom = "20px";
  bubble.style[position] = "20px";
  bubble.style.width = "56px";
  bubble.style.height = "56px";
  bubble.style.borderRadius = "50%";
  bubble.style.backgroundColor = color;
  bubble.style.color = "white";
  bubble.style.display = "flex";
  bubble.style.alignItems = "center";
  bubble.style.justifyContent = "center";
  bubble.style.cursor = "pointer";
  bubble.style.fontSize = "24px";
  bubble.style.zIndex = "9999";
  document.body.appendChild(bubble);

  // Créer la fenêtre de chat (cachée au départ)
  const chatWindow = document.createElement("div");
  chatWindow.style.position = "fixed";
  chatWindow.style.bottom = "90px";
  chatWindow.style[position] = "20px";
  chatWindow.style.width = "320px";
  chatWindow.style.height = "400px";
  chatWindow.style.background = "#fff";
  chatWindow.style.border = `2px solid ${color}`;
  chatWindow.style.borderRadius = "12px";
  chatWindow.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  chatWindow.style.display = "none";
  chatWindow.style.flexDirection = "column";
  chatWindow.style.overflow = "hidden";
  chatWindow.style.zIndex = "10000";

  // En-tête
  const header = document.createElement("div");
  header.innerText = title;
  header.style.background = color;
  header.style.color = "white";
  header.style.padding = "10px";
  header.style.fontFamily = "sans-serif";
  chatWindow.appendChild(header);

  // Zone de messages
  const messages = document.createElement("div");
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  messages.style.fontFamily = "sans-serif";
  messages.innerHTML = `<div style="margin-bottom:8px;color:${color};">${greet}</div>`;
  chatWindow.appendChild(messages);

  // Zone de saisie
  const inputContainer = document.createElement("div");
  inputContainer.style.display = "flex";
  inputContainer.style.borderTop = "1px solid #ddd";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Écrire un message...";
  input.style.flex = "1";
  input.style.border = "none";
  input.style.padding = "10px";
  input.style.outline = "none";

  const sendBtn = document.createElement("button");
  sendBtn.innerText = "➤";
  sendBtn.style.background = color;
  sendBtn.style.color = "white";
  sendBtn.style.border = "none";
  sendBtn.style.padding = "0 15px";
  sendBtn.style.cursor = "pointer";

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  chatWindow.appendChild(inputContainer);

  document.body.appendChild(chatWindow);

  // Ouvrir/fermer la fenêtre au clic sur la bulle
  bubble.onclick = () => {
    chatWindow.style.display =
      chatWindow.style.display === "none" ? "flex" : "none";
  };

  // Envoi de message
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    // Afficher le message côté utilisateur
    const userMsg = document.createElement("div");
    userMsg.innerText = text;
    userMsg.style.margin = "5px 0";
    userMsg.style.textAlign = "right";
    userMsg.style.color = "#333";
    messages.appendChild(userMsg);
    messages.scrollTop = messages.scrollHeight;
    input.value = "";

    // Envoyer au webhook n8n
    if (endpoint) {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      })
        .then((res) => res.json())
        .then((data) => {
          const botMsg = document.createElement("div");
          botMsg.innerText = data.reply || "(Pas de réponse)";
          botMsg.style.margin = "5px 0";
          botMsg.style.textAlign = "left";
          botMsg.style.color = color;
          messages.appendChild(botMsg);
          messages.scrollTop = messages.scrollHeight;
        })
        .catch((err) => {
          const errorMsg = document.createElement("div");
          errorMsg.innerText = "Erreur de connexion au serveur.";
          errorMsg.style.margin = "5px 0";
          errorMsg.style.textAlign = "left";
          errorMsg.style.color = "red";
          messages.appendChild(errorMsg);
        });
    }
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
