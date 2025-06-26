// === Initialization ===
let quotes = loadQuotes() || [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// === Utility: Load from Local Storage ===
function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  return stored ? JSON.parse(stored) : null;
}

// === Utility: Save to Local Storage ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// === Show Random Quote + Save to Session Storage ===
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const display = document.getElementById("quoteDisplay");

  display.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(quote)); // Save last shown quote
}

// === Add a New Quote ===
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();

    document.getElementById("quoteDisplay").innerHTML = `
      <p>"${newQuote.text}"</p>
      <small><em>Category: ${newQuote.category}</em></small>
    `;

    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please fill in both fields.");
  }
}

// === Create the Form Dynamically ===
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

// === Export Quotes as JSON File ===
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// === Import Quotes from JSON File ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Load Last Viewed Quote from Session Storage ===
function loadLastViewedQuote() {
  const stored = sessionStorage.getItem("lastQuote");
  if (stored) {
    const quote = JSON.parse(stored);
    const display = document.getElementById("quoteDisplay");
    display.innerHTML = `
      <p>"${quote.text}"</p>
      <small><em>Category: ${quote.category}</em></small>
    `;
  }
}

// === Event Listeners and Initial Calls ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
loadLastViewedQuote();
