let quotes = loadQuotes() || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// === Local Storage ===
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : null;
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
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length > 0) {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    displayQuote(quote);
  } else {
    document.getElementById("quoteDisplay").innerHTML = "No quotes in this category.";
  }
}

// === Add Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Fill in both fields.");

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  displayQuote(newQuote);

  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// === Create Form ===
function createAddQuoteForm() {
  const container = document.getElementById("formContainer");
  container.innerHTML = `
    <h3>Add a New Quote</h3>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// === Category Filter ===
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
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// === JSON Import/Export ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showSyncNotification("Quotes imported.");
      }
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quotes.json";
  a.click();
}

// === Server Sync ===
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// ✅ POST quote to server
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (e) {
    console.warn("POST failed:", e);
  }
}

// ✅ GET + Sync with conflict resolution
async function syncQuotes() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    let added = 0;
    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(q => q.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        added++;
      }
    });

    if (added > 0) {
      saveQuotes();
      populateCategories();
      showSyncNotification(`Synced ${added} new quotes from server.`);
    }
  } catch (e) {
    console.error("Sync failed:", e);
  }
}

// ✅ UI sync notification
function showSyncNotification(msg) {
  const banner = document.createElement("div");
  banner.textContent = msg;
  banner.style.cssText = `
    background: #cce5ff;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #007bff;
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
setInterval(syncQuotes, 30000); // 🔄 Every 30s
syncQuotes();
