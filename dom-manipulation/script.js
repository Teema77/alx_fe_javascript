// 1. Quotes array
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Do not take life too seriously. You will never get out of it alive.", category: "Humor" },
];

// 2. Function to display a random quote
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

// 4. Event listener for "Show New Quote"
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
