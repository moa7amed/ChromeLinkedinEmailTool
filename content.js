// Debug to confirm the content script loaded
console.log("Content script loaded with jQuery:", window.location.href);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractEmails") {
    console.log("ExtractEmails action received");

   const emails=getemails();
    console.log("Extracted emails:", emails);
    sendResponse({ emails: emails });
  }
});

// Detect when the DOM is updated (useful for SPAs or dynamic content)
function onPageLoad() {
  const emails=getemails();
  console.log(emails);

}

// Monitor dynamic changes to the DOM using jQuery
$(document).ready(() => {
 
  onPageLoad();

  // Set up a MutationObserver to detect dynamic content changes
  const observer = new MutationObserver(() => {
   // console.log("Dynamic content updated");
    onPageLoad();
  });

  // Observe the entire document for changes
  observer.observe(document.body, { childList: true, subtree: true });
});

// Detect URL changes in Single Page Applications (SPAs)
let previousUrl = window.location.href;
setInterval(() => {
  const currentUrl = window.location.href;
  if (previousUrl !== currentUrl) {
    previousUrl = currentUrl;
    console.log("URL changed to:", currentUrl);
    onPageLoad();
  }
}, 1000);


function getemails()
{
   // Use jQuery to extract all text from the page
   const pageText = $("body").text(); // Gets all visible text from the <body>
   const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
   const emails = pageText.match(emailRegex);

   // Send unique emails back to the popup
   const uniqueEmails = emails ? Array.from(new Set(emails)) : [];
   return uniqueEmails;
}