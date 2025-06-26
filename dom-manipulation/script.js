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

// === Show a Random Quote ===
function showRandomQuote() {
  filterQuotes(); // Now obeys filter
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
    populateCategories(); // update dropdown

    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
    displayQuote(newQuote);
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

// === Load Last Viewed Quote on Page Load ===
function loadLastViewedQuote() {
  const stored = sessionStorage.getItem("lastQuote");
  if (stored) {
    const quote = JSON.parse(stored);
    displayQuote(quote);
  } else {
    filterQuotes();
  }
}

// === Init ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
populateCategories();
loadLastViewedQuote();
