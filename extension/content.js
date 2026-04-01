function scrapeReviews() {
  const reviewElements = document.querySelectorAll('[data-hook="review-body"]');
  console.log("Reviews found:", reviewElements.length);
  const reviews = Array.from(reviewElements)
    .map(el => el.innerText.trim())
    .filter(text => text.length > 20); // filter out empty or junk reviews

  return reviews.slice(0, 24); // cap at 24 to keep API costs down
}

async function sendReviewsToBackend(reviews) {
  const response = await fetch("http://localhost:8080/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reviews })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let summary = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    summary += decoder.decode(value, { stream: true });
  }

  return summary;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "scrape") {
    const reviews = scrapeReviews();
    sendReviewsToBackend(reviews)
      .then(summary => sendResponse({ success: true, summary, reviewCount: reviews.length }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});