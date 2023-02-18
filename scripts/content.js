/** @format */
let isActive = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'send-connect-request') {
    isActive = true;
    const list = document.querySelector('.reusable-search__entity-result-list');
    const nextButton = getNextButton();
    //loop through the list and get the data using a recursive function to find the button  with connect text
    // this will help us avoid the button that have ether message text or pending or other text
    const arr = [];
    findConnectButton(list,arr);
    //clicking the button ever 1 sec
    let i = 0;
    const interval = setInterval(() => {
      if(i < arr.length){
        if (!isActive) {
          //if the user clicks the stop button, we will stop the process
          clearInterval(interval);
          return;
        }
        //clicking the button
        arr[i].click();
        i++;
        //waiting for the modal to appear
        setTimeout(() => {
          //calling the modal manager function to handle the modal
          modalManager();
        }, Math.floor(Math.random() * 600) + 750);
        //sending the message to the popup to update the count
        chrome.runtime.sendMessage({ message: 'update-count' });
      }else{
        nextButton.click();
        chrome.runtime.sendMessage({ message: 'loading-finished' });
        clearInterval(interval);
      }
    }
    ,Math.floor(Math.random() * 2500) + 1000);                                           
  }
  //if the user clicks the stop button, we will stop the process
  if (request.message === 'stop-connect-request') {
    isActive = false;
  }
  
});


//This function will find the button with text connect
// A lot of function can be removed if we use this function to find the button
// and take a third element innerText  as a parameter and programmatically find the button
// but i will use the function less times to avoid the overhead of the recursive function and to show other approaches too
function findConnectButton(node,arr){
if(node.nodeName === 'BUTTON'){
  //checking if the button have a span child with text connect
    if(node.children[0].innerText === 'Connect')  arr.push(node);
   }else{
    for(let i = 0; i < node.children.length; i++){
      findConnectButton(node.children[i],arr);
    }
  }
 
}

function getNextButton(){

  const view = document.querySelector('.artdeco-pagination');
  const buttons = view.querySelectorAll('button');
  for(let i = 0; i < buttons.length; i++){
   //checking the aria-label of the button to find the next button
    if(buttons[i].getAttribute('aria-label') === 'Next'){
      return buttons[i];
    }

  }
}

// After connecting to a person, a modal will appear with a list of actions to perform
// Sometimes it asks you to select a reason for connecting, sometimes it allows you to send a req directly
// This function will check for the modal and perform the appropriate action
function modalManager(){
  // I can get the action button by directly getting the footer element of the modal
  // But instead of that we will take a generalize approach here. so we can easily update the code if linkedin changes the modal.
  // As we will only have to give the new modal class. everything else will be handled by the code.
  const modal = document.getElementById('artdeco-modal-outlet');
  const allActions = modal.querySelectorAll('button');
  const pillSelectorsGroup = modal.querySelectorAll('.artdeco-pill-choice-group');
  if (pillSelectorsGroup.length > 0) {
    // In this scenario there will be a list of pills to select from
    // We will chose Other as out reason for connecting
    const pillSelectors = pillSelectorsGroup[0].querySelectorAll('button');
    pillSelectors.forEach((element) => {
      if (element.innerText === 'Other') {
        element.click();
      }
    });
    // After selecting the pill, we will find the connect button and click it
    allActions.forEach((element) => {
      if (
        element.hasChildNodes() === true &&
        element.children[0] !== null &&
        element.children[0] !== undefined
      ) {
        if (
          element.children[0].tagName === 'SPAN' &&
          element.children[0].innerText === 'Connect'
        )
        //wating 250 ms to click the button
          setTimeout(() => {
          element.click();
        }, Math.floor(Math.random() * 250) + 100);
      }
    });
  } else {
    // In this scenario there will be a button with text send
    allActions.forEach((element) => {
      if (element.children[0].innerText === 'Send') {
        element.click();
      }
    });
  }

}