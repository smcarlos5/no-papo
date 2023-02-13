window.onload = () => {
  // DOM elements
  const d = document;
  const nicknameInput = d.getElementById("nickname-input");
  const participantsList = d.getElementById("participants-list");
  const chatBoard = d.getElementById("chat-board");
  const msgInput = d.getElementById("msg-input");
  const nickDisplay = d.getElementById("own-nick-display");
  const modal = d.getElementById("modal");
  const sendBtn = d.getElementById("send-btn");
  const onlineNumSpan = d.getElementById("online-number");

  // SOCKET.IO connecting
  const socket = io();
  
  // RECEIVING  
  socket.on("connection", (data) => {
    refreshParticipantList(data.list);
    refreshOnlineNumber(data.list.length);
  });

  socket.on("participant joined", (data) => {
    addNewNofication(data.nickname, "entered");
    refreshParticipantList(data.list);
    refreshOnlineNumber(data.list.length);
  });

  socket.on("new message", (data) => {
    addNewMessageBubble(data.nickname, data.message, "others");
    autoScroll();
  });

  socket.on("participant left", (data) => {
    addNewNofication(data.nickname, "left");
    refreshParticipantList(data.list);
    refreshOnlineNumber(data.list.length);
  });

  // EMITTING 
  const submitNickname = (e) => {
    if (e.key === "Enter") {
      nickname = nicknameInput.value;
      nickDisplay.innerHTML = nickname;
      hide(modal);

      socket.emit("add participant", nickname);
    }
  }

  const submitMessage = () => {
    const message = msgInput.value;
    addNewMessageBubble("", message, "own");
    clearMsgInput();
    autoScroll();

    socket.emit("new message", message);
  }

  // DOM manipulation
  const hide = (el) => {
    el.setAttribute("class", "hidden");
  }

  const clearMsgInput = () => {
    msgInput.value = "";
  }

  const refreshOnlineNumber = (num) => {
    onlineNumSpan.innerHTML = num;
  }

  const addNewNofication = (nick, opt) => {
    const notificationP = d.createElement("p");    
    const nickSpan = d.createElement("span");
    nickSpan.innerHTML = nick;
    nickSpan.classList.add("c-board__nick");
    
    if (opt === "entered") {
      notificationP.classList.add("c-board__notif--entered");
      notificationP.innerHTML = " has entered the chat.";
      
    } else {
      notificationP.classList.add("c-board__notif--left");
      notificationP.innerHTML = " has left the chat.";
    }

    notificationP.prepend(nickSpan);     
    chatBoard.appendChild(notificationP);
  }
  
  const addNewMessageBubble = (nick, message, opt) => {
    const bubbleArticle = d.createElement("article");
    const bubbleClass = opt === "own"?"c-board__bubble--own":"c-board__bubble--others";
    bubbleArticle.classList.add(bubbleClass);

    const nickP = d.createElement("p");
    nickP.classList.add("c-board__nick");
    nickP.innerHTML = nick;
    bubbleArticle.appendChild(nickP);
    
    const messageP = d.createElement("p");
    messageP.classList.add("c-board__msg");
    messageP.innerHTML = message;
    bubbleArticle.appendChild(messageP);

    chatBoard.appendChild(bubbleArticle);
  }

  const refreshParticipantList = (participants) => {
    // clear participants list
    while(participantsList.firstChild)
      participantsList.firstChild.remove();

    // append fresh list
    participants.forEach(p => {
      const participantLi = d.createElement("li");
      participantLi.classList.add("p-list__nick");
      participantLi.innerHTML = p;
      
      participantsList.appendChild(participantLi);
    });
  }

  const autoScroll = () => {
    chatBoard.lastChild.scrollIntoView();
  }

  // EVENT LISTENERS
  nicknameInput.addEventListener("keydown", submitNickname);
  msgInput.addEventListener("keydown", (e) => e.key==="Enter"?submitMessage():0);
  sendBtn.addEventListener("click", submitMessage);

}