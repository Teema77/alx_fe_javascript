let quotes = loadQuotes() || [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "To be or not to be.", category: "Philosophy" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" }
];

// === Storage ===
function loadQuotes() {
  const data = localStorage.getItem("quotes");
  return data ? JSON.parse(data) : null;
}
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Display ===
function displayQuote(quote) {
  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}
function showRandomQuote() {
  const category = document.getElementById("categoryFilter").value;
  const filtered = category === "all" ? quotes : quotes.filter(q => q.category === category);
  if (filtered.length > 0) {
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    displayQuote(random);
  } else {
    document.getElementById("quoteDisplay").innerText = "No quotes in this category.";
  }
}

// === Add Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please enter both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayQuote(newQuote);
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}
function createAddQuoteForm() {
  document.getElementById("formContainer").innerHTML = `
    <h3>Add a Quote</h3>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// === Filter ===
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";
  const categories = [...new Set(quotes.map(q => q.category))];
  dropdown.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    dropdown.appendChild(option);
  });
}
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", category);
  showRandomQuote();
}

// === Import / Export ===
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showSyncNotification("Quotes imported successfully.");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(event.target.files[0]);
}
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

// ✅ === POST Quote to Server ===
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.error("POST error:", err);
  }
}

// ✅ === FETCH Quotes from Server ===
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// ✅ === SYNC Quotes from Server ===
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let newCount = 0;
  serverQuotes.forEach(sq => {
    if (!quotes.find(q => q.text === sq.text)) {
      quotes.push(sq);
      newCount++;
    }
  });
  if (newCount > 0) {
    saveQuotes();
    populateCategories();
    showSyncNotification("Quotes synced with server!"); // <- Required string
  }
}


// ✅ === Notification Banner ===
function showSyncNotification(message) {
  const banner = document.createElement("div");
  banner.textContent = message;
  banner.style.cssText = `
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
    padding: 10px;
    margin: 10px;
    font-weight: bold;
  `;
  document.body.prepend(banner);
  setTimeout(() => banner.remove(), 4000);
}

// === Init ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
populateCategories();
showRandomQuote();
setInterval(syncQuotes, 30000);
syncQuotes();
