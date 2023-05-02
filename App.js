const centerDetails = document.getElementById("center-details");
const input = document.querySelector("input");
const cityBtn = document.getElementById("city");
const stateBtn = document.getElementById("state");
const centerBtn = document.getElementById("center");
const searchIcon = document.querySelector("i");

let activeBtn = null;

let centersData = {};
async function fetchIsroCentersData() {                   // when we make a function as aync it returns a promise
  const apiUrl = "https://isro.vercel.app/api/centres";   //API URL
  try {
    const response = await fetch(apiUrl);      //fetch send the request and returns promise  As we know, async/await allows us to write asynchronous code in a much cleaner way. It allows us to avoid the headaches of using callbacks and then catch syntax in our code.That’s why I always prefer using async/await when using the fetch
    if (!response.ok) {
      throw new Error("Not Found");            
    }
    centersData = await response.json();        // The response object, returned by the await fetch(). response.json() is a method of the Response object that allows a JSON object to be extracted from the response. The method returns a promise, so you have to wait for the JSON: await response.json().
    displayIsroCentersData();                  //display centers data method called
  } catch (error) {
    console.log(error.message);                //if response will not comes it throw  an error  like "Not found"
  }
}

async function displayIsroCentersData() {
  centerDetails.innerHTML = "";                         
  const fragment = document.createDocumentFragment();    //it creates fragment   

  for (const center of centersData.centres) {            //centers data whatever we get from previous function get one by one in center
    const parent = document.createElement("div");         //create new element of div
    parent.classList.add("centers-info");                //add centers-info into parent
    for (const key in center) {                          //for in loop to getting key from center
      if (key !== "id") {
        const child = document.createElement("p");
        child.textContent = center[key];            
        parent.appendChild(child);
      }
    }
    fragment.appendChild(parent);
  }
  centerDetails.append(fragment);
}

fetchIsroCentersData();           // calling a function of fetch isro center data 

function searchCenters() {
  const inputKey = input.value.toLowerCase();
  //console.log(inputKey);

  centerDetails.innerHTML = "";

  if (!activeBtn) {                                                              //check button is active or not it simply returns error as given below and return
    centerDetails.innerHTML = `<p class="error">Please select a category</p>`;     
    return;
  }

  if (!inputKey) {
    centerDetails.innerHTML = `<p class="error">Please enter a ${activeBtn.id} name </p>`;   //if we taken city name but we select button of state or center name we found error like please enter a valid center or state name
    return;
  }

  let finderKey = activeBtn.name;                         // put in finderKey of active button name
  const fragment = document.createDocumentFragment();     // create a fragment

  //console.log(finderKey);

  for (const center of centersData.centres) {  
    if (center[finderKey].toLowerCase().includes(inputKey)) {
      const parent = document.createElement("div");
      parent.classList.add("centers-info");
      for (const key in center) {
        if (key !== "id") {
          const child = document.createElement("p");
          child.textContent = center[key];
          parent.appendChild(child);
        }
      }
      fragment.appendChild(parent);
    }
  }

  if (!fragment.childElementCount) {
    centerDetails.innerHTML = `<p class="error">Please enter a valid ${activeBtn.id} name </p>`;
    return;
  }

  centerDetails.append(fragment);
}

function activate(event) {
  event.target.classList.toggle("active");
  if (activeBtn && event.target.id === activeBtn.id) {    //if button is active any of(city ,state,center)
    activeBtn = null;
    displayIsroCentersData();
    //console.log(activeBtn);
    return;
  }
  if (activeBtn) activeBtn.classList.toggle("active");

  activeBtn = event.target;
  //console.log(activeBtn);
}

cityBtn.addEventListener("click", activate);      //after city butoon clicked it gets activate like all button state and center
stateBtn.addEventListener("click", activate);
centerBtn.addEventListener("click", activate);

searchIcon.addEventListener("click", searchCenters);  //after clicking on search it search center 

input.addEventListener("keypress", function (event) {  //after pressing the key in search icon an event generated
  if (event.key === "Enter") {                         //after typing something in search bar and pressing enter key it calls search center
    searchCenters();
  }
});

