
// first function that kicks off the process

chrome.runtime.onInstalled.addListener((details) => {
    // confirm installation is happening
    console.log("Extension installed.");

    // Sends a message to the popup.js file that will listen for "updatePopupUI"
    chrome.runtime.sendMessage({ action: "updatePopupUI" });
});



//message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Check if the message contains the text content
    if (message.textContent) {
        const pageText = message.textContent;
        // Now you can use the text content for further processing
        console.log("Text content of the current page:", pageText);
        // Example: Send the text content to an API endpoint
        // Replace 'YOUR_API_ENDPOINT' with the actual endpoint
        fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'OPENAI_API_KEY'
            },
            body: JSON.stringify({ text: pageText })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from API:", data);
            // Perform further actions with the response if needed
        })
        .catch(error => {
            console.error("Error:", error);
        });
    }
});


//click listner
// This script will be loaded as a service worker for the Chrome Extension.
// It listens for clicks on the extension's icon and executes scripts in response.

// Adding an event listener for when the extension's icon is clicked in the toolbar.
try {
    chrome.action.onClicked.addListener((tab) => {
        // `tab` contains information about the current active tab

        // This function is executed in the context of the current active tab.
        chrome.scripting.executeScript({
            target: { tabId: tab.id }, // Specifies which tab to target with the script execution
            function: function() {
                // This function is injected and executed in the current tab
                // Here, we simply display an alert within the tab
                alert('Hello from your Chrome Extension!');
            }
        });
    });
} catch (error) {
    // Catches and logs any errors that occur during the event listener setup or script execution
    console.error('Error in background script:', error);
}


//install listener