const btn = document.getElementById("btn-summarize");
const status = document.getElementById("status");
const result = document.getElementById("result");
const reviewCount = document.getElementById("review-count");

function setStatus(message, loading = false) {
  status.innerHTML = loading
    ? `<div class="spinner"></div><span>${message}</span>`
    : `<span>${message}</span>`;
}

function showResult(text, isError = false) {
  result.innerHTML = isError ? text : marked.parse(text);
  result.className = isError ? "visible error" : "visible";
}

btn.addEventListener("click", async () => {
  btn.disabled = true;
  result.className = "";
  reviewCount.style.display = "none";
  setStatus("Reading reviews from page...", true);

  try {
    // Get the active tab and send message to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const response = await chrome.tabs.sendMessage(tab.id, { action: "scrape" });

    if (!response.success) {
      throw new Error(response.error || "Failed to scrape reviews");
    }

    if (!response.summary) {
      throw new Error("No reviews found on this page");
    }

    reviewCount.textContent = `${response.reviewCount} reviews analysed`;
    reviewCount.style.display = "block";
    setStatus("Done!");
    showResult(response.summary);

  } catch (err) {
    setStatus("");
    showResult(
      err.message.includes("Cannot establish connection")
        ? "No reviews found. Navigate to a product page first."
        : `Error: ${err.message}`,
      true
    );
  } finally {
    btn.disabled = false;
  }
});