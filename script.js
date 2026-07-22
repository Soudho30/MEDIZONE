const medicines = [
    { id: 1, name: "Napa Extend 665mg (Paracetamol)", category: "Painkillers", price: 35.00, available: true, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300" },
    { id: 2, name: "Ace Plus Strip", category: "Painkillers", price: 40.00, available: true, image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=300" },
    { id: 3, name: "Zimax 500mg (Azithromycin)", category: "Antibiotics", price: 210.00, available: true, image: "https://images.unsplash.com/photo-1628771065518-0d82f1113871?auto=format&fit=crop&q=80&w=300" },
    { id: 6, name: "Seclo 20mg Capsules", category: "Antibiotics", price: 140.00, available: false, image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300" },
    { id: 4, name: "Bextram Gold Tablets", category: "Vitamins", price: 270.00, available: true, image: "https://images.unsplash.com/photo-1616679911721-eff6eec18fcd?auto=format&fit=crop&q=80&w=300" },
    { id: 5, name: "Ceevit Chewable 250mg", category: "Vitamins", price: 50.00, available: true, image: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=300" },
    { id: 7, name: "Camlodin 5mg (Amlodipine)", category: "BP", price: 120.00, available: true, image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300" },
    { id: 8, name: "Angilock 50mg (Losartan)", category: "BP", price: 180.00, available: true, image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=300" },
    { id: 9, name: "Cerave Hydrating Cleanser", category: "Skin Care", price: 1450.00, available: true, image: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=300" },
    { id: 10, name: "Cetaphil Moisturizing Cream", category: "Skin Care", price: 1280.00, available: true, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=300" },
    { id: 11, name: "Johnson's Baby Lotion 200ml", category: "Baby Care", price: 420.00, available: true, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300" },
    { id: 12, name: "Meril Baby Wipes Pack", category: "Baby Care", price: 185.00, available: true, image: "https://images.unsplash.com/photo-1595231712426-63e26b52c002?auto=format&fit=crop&q=80&w=300" }
];
let cart = [];
let currentCategoryFilter = 'all';
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById("medicine-grid")) {
        renderCatalogGrid(medicines);
    }
});
function renderCatalogGrid(productsList) {
    const grid = document.getElementById("medicine-grid");
    grid.innerHTML = "";
    if (productsList.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center my-5 py-4">
                <i class="fas fa-box-open text-muted fs-1 mb-3"></i>
                <h5 class="text-secondary fw-medium">No medical items match your search.</h5>
            </div>`;
        return;
    }    
    productsList.forEach(item => {
        const outOfStockAction = !item.available ? 'disabled' : '';
        const actionButtonStyle = item.available ? 'btn-primary' : 'btn-danger opacity-75';
        const buttonText = item.available ? '<i class="fas fa-cart-plus me-2"></i>Add to Cart' : '<i class="fas fa-ban me-2"></i>Out of Stock';       
        grid.innerHTML += `
            <div class="col-xl-3 col-lg-4 col-sm-6">
                <div class="card card-medicine h-100 position-relative overflow-hidden border-0">
                    <span class="badge medicine-badge rounded-pill px-3 py-2 text-white font-monospace">${item.category}</span>
                    <img src="${item.image}" class="card-img-top w-100" style="height: 190px; object-fit: cover;" alt="${item.name}">
                    <div class="card-body d-flex flex-column justify-content-between p-3">
                        <div class="mb-2">
                            <h6 class="card-title text-dark fw-bold mb-1 small">${item.name}</h6>
                            <p class="text-primary fw-bold fs-5 mb-0">৳ ${item.price.toFixed(2)}</p>
                        </div>
                        <button onclick="addItemToBasket(${item.id})" class="btn w-100 btn-custom py-2 ${actionButtonStyle}" ${outOfStockAction}>
                            ${buttonText}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}
function filterMedicines(categorySelection, elementTarget) {
    currentCategoryFilter = categorySelection;
    const actionButtons = document.querySelectorAll(".filter-btn");
    actionButtons.forEach(btn => btn.classList.remove("active"));
    if(elementTarget) elementTarget.classList.add("active");
    executeCombinedFilters();
}
function searchInventory() {
    executeCombinedFilters();
}
function executeCombinedFilters() {
    const searchString = document.getElementById("catalogSearch").value.toLowerCase().trim();
    const operationalResult = medicines.filter(item => {
        const matchesCategory = (currentCategoryFilter === 'all' || item.category === currentCategoryFilter);
        const matchesSearch = item.name.toLowerCase().includes(searchString) || item.category.toLowerCase().includes(searchString);
        return matchesCategory && matchesSearch;
    });   
    renderCatalogGrid(operationalResult);
}
function addItemToBasket(id) {
    const targetProduct = medicines.find(m => m.id === id);
    if (!targetProduct || !targetProduct.available) return;

    const existingCartEntry = cart.find(item => item.id === id);
    if (existingCartEntry) {
        existingCartEntry.quantity += 1;
    } else {
        cart.push({ ...targetProduct, quantity: 1 });
    }
    synchronizeCartUI();
}
function synchronizeCartUI() {
    const badgeCount = document.getElementById("cart-count");
    const itemWrapper = document.getElementById("cart-items");
    const totalAmountSpan = document.getElementById("cart-total");
    const calculatedSumItems = cart.reduce((accum, obj) => accum + obj.quantity, 0);
    badgeCount.innerText = calculatedSumItems;
    itemWrapper.innerHTML = "";
    let financialInvoiceTotal = 0;
    if (cart.length === 0) {
        itemWrapper.innerHTML = `
            <div class="text-center py-4 my-2">
                <i class="fas fa-shopping-bag text-muted opacity-50 fs-2 mb-2"></i>
                <p class="text-muted small mb-0">Your medical supply cart is empty.</p>
            </div>`;
    } else {
        cart.forEach(entry => {
            const rowValueSum = entry.price * entry.quantity;
            financialInvoiceTotal += rowValueSum;
            
            itemWrapper.innerHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center rounded-3 mb-2 p-3 border-0 bg-light shadow-sm">
                    <div class="pe-2">
                        <h6 class="mb-1 text-dark fw-bold small">${entry.name}</h6>
                        <span class="text-muted font-monospace small">৳ ${entry.price.toFixed(2)} &times; ${entry.quantity}</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <span class="badge bg-primary rounded-pill px-3 py-2 fw-semibold">৳ ${rowValueSum.toFixed(2)}</span>
                        <button class="btn btn-sm text-danger p-1 border-0" onclick="removeItemFromBasket(${entry.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
    totalAmountSpan.innerText = `৳ ${financialInvoiceTotal.toFixed(2)}`;
}
function removeItemFromBasket(id) {
    cart = cart.filter(item => item.id !== id);
    synchronizeCartUI();
}
function executeCheckoutSequence() {
    if (cart.length === 0) {
        alert("Action rejected: Your shopping basket is empty.");
        return;
    }
    let orderReceiptSummary = "=== MEDIZONE SECURE CHECKOUT OUTLINE ===\n\n";
    cart.forEach(item => {
        orderReceiptSummary += `- ${item.name} [Qty: ${item.quantity}] : ৳ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    orderReceiptSummary += `\nTotal Invoiced Charge: ${document.getElementById("cart-total").innerText}\n\nProceed to payment?`;
    alert(orderReceiptSummary);
    cart = [];
    synchronizeCartUI();   
    const cartModalElement = document.getElementById('cartModal');
    const runningModalInstance = bootstrap.Modal.getInstance(cartModalElement);
    if(runningModalInstance) runningModalInstance.hide();
}
function handleObjectionSubmission(event) {
    event.preventDefault();
    const orderId = document.getElementById("objOrderId").value.trim() || "N/A";
    const category = document.getElementById("objCategory").value;
    const description = document.getElementById("objDescription").value.trim();
    alert(`Thank you for submitting your objection.\n\nCategory: ${category}\nOrder Reference: ${orderId}\n\nOur customer resolution team has logged your complaint and will get back to you within 24 hours.`);
    document.getElementById("objectionForm").reset();
    const objectionModalEl = document.getElementById('objectionModal');
    const modalInstance = bootstrap.Modal.getInstance(objectionModalEl);
    if(modalInstance) modalInstance.hide();
}
let isVoiceActive = false;
let speechRecognitionObj = null;
function toggleChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    const chatIcon = document.getElementById('chatIcon');
    if (chatWindow.classList.contains('d-none')) {
        chatWindow.classList.remove('d-none');
        chatIcon.classList.remove('fa-headset');
        chatIcon.classList.add('fa-times');
    } else {
        chatWindow.classList.add('d-none');
        chatIcon.classList.remove('fa-times');
        chatIcon.classList.add('fa-headset');
    }
}
function sendQuickPrompt(promptText) {
    document.getElementById('chatInput').value = promptText;
    handleUserMessage(new Event('submit'));
}
function handleUserMessage(event) {
    event.preventDefault();
    const chatInput = document.getElementById('chatInput');
    const messageText = chatInput.value.trim();
    if (messageText === '') return;
    appendMessage(messageText, 'user');
    chatInput.value = '';
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const aiReply = processAiQuery(messageText);
        appendMessage(aiReply, 'bot');
        speakTextResponse(aiReply);
    }, 1000);
}
function startVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    const chatInput = document.getElementById('chatInput');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Sorry! Voice Recognition is not supported by your current browser version.");
        return;
    }
    if (!speechRecognitionObj) {
        speechRecognitionObj = new SpeechRecognition();
        speechRecognitionObj.continuous = false;
        speechRecognitionObj.lang = 'en-US';
        speechRecognitionObj.onstart = function() {
            isVoiceActive = true;
            voiceBtn.classList.add('mic-recording');
            chatInput.placeholder = "Listening to your voice...";
        };
        speechRecognitionObj.onresult = function(event) {
            const spokenTranscript = event.results[0][0].transcript;
            chatInput.value = spokenTranscript;
            handleUserMessage(new Event('submit'));
        };
        speechRecognitionObj.onerror = function(event) {
            console.error("Speech Recognition Error: ", event.error);
            stopVoiceRecordingState();
        };
        speechRecognitionObj.onend = function() {
            stopVoiceRecordingState();
        };
    }
    if (isVoiceActive) {
        speechRecognitionObj.stop();
        stopVoiceRecordingState();
    } else {
        speechRecognitionObj.start();
    }
}
function stopVoiceRecordingState() {
    isVoiceActive = false;
    const voiceBtn = document.getElementById('voiceBtn');
    const chatInput = document.getElementById('chatInput');
    if (voiceBtn) voiceBtn.classList.remove('mic-recording');
    if (chatInput) chatInput.placeholder = "Type or speak...";
}
function speakTextResponse(htmlMessage) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = htmlMessage.replace(/<[^>]*>/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';       
        window.speechSynthesis.speak(utterance);
    }
}
function appendMessage(text, sender) {
    const chatBody = document.getElementById('chatBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender} mb-3`;
    const contentDiv = document.createElement('div');
    contentDiv.className = `msg-content p-2 px-3 rounded-3 small shadow-sm ${sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`;
    contentDiv.innerHTML = text;
    msgDiv.appendChild(contentDiv);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
function showTypingIndicator() {
    const chatBody = document.getElementById('chatBody');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typingIndicator';
    typingDiv.className = 'chat-message bot mb-3';
    typingDiv.innerHTML = `
        <div class="msg-content bg-light p-2 px-3 rounded-3 text-dark small shadow-sm">
            <span class="typing-dots"><span></span><span></span><span></span></span> <em>MediBot Care AI is processing...</em>
        </div>`;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) typingIndicator.remove();
}
function processAiQuery(userQuery) {
    const query = userQuery.toLowerCase();
    if (query.includes('fever') || query.includes('headache') || query.includes('pain')) {
        return "For fever or mild pain, Napa Extend 665mg or Ace Plus are recommended. You can browse our Pain Relief category.";
    }
    if (query.includes('bp') || query.includes('pressure') || query.includes('hypertension')) {
        return "We have Camlodin 5mg and Angilock 50mg available in our BP Control section.";
    }
    if (query.includes('skin') || query.includes('face') || query.includes('cleanser') || query.includes('cream')) {
        return "We stock Cerave Hydrating Cleanser for 1450 Taka and Cetaphil Cream for 1280 Taka in Skin Care.";
    }
    if (query.includes('baby') || query.includes('infant') || query.includes('wipe')) {
        return "In our Baby Care category, we have Johnson's Baby Lotion and Meril Baby Wipes.";
    }
    if (query.includes('bkash') || query.includes('payment') || query.includes('pay') || query.includes('card')) {
        return "You can pay via bKash, Nagad, Credit or Debit cards, or Cash on Delivery.";
    }
    if (query.includes('delivery') || query.includes('ship') || query.includes('time')) {
        return "Standard delivery takes 24 to 48 hours across Bangladesh. Delivery is free for all orders.";
    }
    if (query.includes('policy') || query.includes('return') || query.includes('refund')) {
        return "Unopened products can be returned within 7 days. Prescription and refrigerated medicines are non-refundable. Check our Policy section for details!";
    }
    const matchedProduct = medicines.find(m => query.includes(m.name.toLowerCase()) || query.includes(m.category.toLowerCase()));
    if (matchedProduct) {
        return `We have ${matchedProduct.name} available for ${matchedProduct.price.toFixed(2)} Taka in stock.`;
    }
    if (query.includes('hi') || query.includes('hello') || query.includes('hey')) {
        return "Hello! I am MediBot Care AI. Ask me anything or tap the microphone to speak.";
    }
    return "I am MEDIZONE support AI! You can ask me about medicine prices, stock, delivery options, pharmacy policies, or skincare and baby care products.";
}