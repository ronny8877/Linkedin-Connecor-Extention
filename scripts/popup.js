/** @format */

let isActive= false
const countView = document.getElementById('count-view');
const actionButton = document.getElementById('action-button');
let activeTabId;

//getting the active tab id
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  activeTabId = tabs[0].id;
});

actionButton.addEventListener('click', function () {
  isActive = !isActive;
  if (isActive) {
    //sending message to start the process
    //and changing the button style
  chrome.tabs.sendMessage(activeTabId, { message: 'send-connect-request' });
  actionButton.setAttribute('loading', 'inline-loading'); 
  actionButton.setAttribute('outline', 'outline-secondary');
  actionButton.innerText = 'Stop';
}
else{
  actionButton.removeAttribute('loading');
  actionButton.removeAttribute('outline');
  actionButton.innerText = 'Add Connection';
  //send message to stop the process
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(activeTabId, { message: 'stop-connect-request' });
  }
  );
}
});

//to make it work on the second page we can just send the event back again and the process will continue
//but i will just stop it here as that's not the main focus of this project
// as that will require addition code to maintain presistance of the count and the state of the process
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //updating the count
  if (request.message === 'update-count') {
    countView.innerText = parseInt(countView.innerText) + 1;
  }
  if (request.message === 'loading-finished') {
    actionButton.removeAttribute('loading');
    actionButton.removeAttribute('outline');
    actionButton.innerText = 'Add Connection';
  }
});