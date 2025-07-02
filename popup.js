chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
  

      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          files: ["content.js"]
        },
        () => {
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "extractEmails" },
            (response) => {
              const emailList = document.getElementById("emailList");
              const copyButton = document.getElementById("copyEmails");
              if (response?.emails && response.emails.length > 0) {
                emailList.innerHTML = response.emails
                  .map((email) => `<li>${email}</li>`)
                  .join("");

                  copyButton.setAttribute("data-emails", response.emails.join("\n"));
              } else {
                emailList.innerHTML = "<li>No emails found.</li>";
              }
            }
          );
        }
      );
   
  });
  document.getElementById("copyEmails").addEventListener("click", () => {
    const copyButton = document.getElementById("copyEmails");
    const emails = copyButton.getAttribute("data-emails");
  
    if (emails) {
      navigator.clipboard
        .writeText(emails)
        .then(() => {
          alert("Emails copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy emails:", err);
        });
    }
  });


  document.addEventListener("DOMContentLoaded", () => {
    onPageLoad();
  });