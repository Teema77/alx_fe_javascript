// 1. Quotes array
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// 2. Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const display = document.getElementById("quoteDisplay");

  display.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

// 3. Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });

    document.getElementById("quoteDisplay").innerHTML = `
      <p>"${quoteText}"</p>
      <small><em>Category: ${quoteCategory}</em></small>
    `;

    document.getElementById("newQuoteText").value = '';
    document.getElementById("newQuoteCategory").value = '';
  } else {
    alert("Please enter both quote text and category.");
  }
}

// 4. Function to create the add-quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

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

  formContainer.appendChild(heading);
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);
}

// 5. Attach event listener to "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// 6. Create the form when the page loads
createAddQuoteForm();
