let quotes = loadQuotes() || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// === Utility: Local Storage ===
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : null;
}
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Populate Category Dropdown ===
function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";

  const categories = Array.from(new Set(quotes.map(q => q.category)));
  dropdown.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    if (category === selected) option.selected = true;
    dropdown.appendChild(option);
  });
}

// === Filter and Display Quotes ===
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length > 0) {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    displayQuote(quote);
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  } else {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
  }
}

// === Show Random Quote ===
function showRandomQuote() {
  filterQuotes(); // Respects category
}

// === Display One Quote ===
function displayQuote(quote) {
  const display = document.getElementById("quoteDisplay");
  display.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

// === Add a New Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // Update dropdown

    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    displayQuote(newQuote);
  } else {
    alert("Please fill in both fields.");
  }
}

// === Create the Add Form ===
function createAddQuoteForm() {
  const container = document.getElementById("formContainer");

  const heading = document.createElement("h3");
  heading.textContent = "Add a New Quote";

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(heading);
  container.appendChild(inputText);
  container.appendChild(inputCategory);
  container.appendChild(addButton);
}

// === Import Quotes ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Export Quotes ===
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// === Load Last Viewed Quote ===
function loadLastViewedQuote() {
  const stored = sessionStorage.getItem("lastQuote");
  if (stored) {
    const quote = JSON.parse(stored);
    displayQuote(quote);
  } else {
    filterQuotes();
  }
}

// === Server Simulation ===
const MOCK_SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
let serverQuotes = [];

async function fetchQuotesFromServer() {
  try {
    const res = await fetch(MOCK_SERVER_URL);
    const data = await res.json();

    const simulated = data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));

    serverQuotes = simulated;
    return simulated;
  } catch (err) {
    console.error("Server fetch failed:", err);
    return [];
  }
}

async function syncWithServer() {
  const serverData = await fetchQuotesFromServer();
  let updated = false;

  serverData.forEach(serverQuote => {
    const exists = quotes.some(
      local => local.text === serverQuote.text && local.category === serverQuote.category
    );
    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showSyncNotification("Quotes synced from server. New quotes added.");
  }
}

// === Sync Banner UI ===
function showSyncNotification(message) {
  const banner = document.createElement("div");
  banner.textContent = message;
  banner.style.backgroundColor = "#ffeb3b";
  banner.style.padding = "10px";
  banner.style.border = "1px solid #ccc";
  banner.style.margin = "10px 0";
  banner.style.fontWeight = "bold";

  document.body.insertBefore(banner, document.body.firstChild);
  setTimeout(() => banner.remove(), 5000);
}

// === Initialize ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
populateCategories();
loadLastViewedQuote();
syncWithServer();
setInterval(syncWithServer, 30000); // every 30 seconds
