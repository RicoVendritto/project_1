let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApiCL = "https://api.football-data.org/v2/competitions/CL/matches";
let urlApiTeams = "https://api.football-data.org/v2/competitions/CL/teams";
let urlApiClubs = "https://api.football-data.org/v2/teams/";

let checkPage = document.querySelector("body");
let checkPageAttribute = checkPage.getAttribute("data-title");


/*
########## HOMEPAGE ##########
*/

if (checkPageAttribute === "indexPage") {

  const logoDiv = document.querySelector(".logo");
  const logoField = document.querySelector(".main");
  logoField.addEventListener("click", goGoGo);
  const loader = document.querySelector(".lds-ripple");
  const background = document.querySelector("#background");


  function processApi(evt) {
    evt.preventDefault();
    getAllClubDetails();
  }

  window.onload = function (evt) {
    evt.preventDefault();
    overviewTeams();
  };

  async function overviewTeams() {
    console.log("Api CL Teams Call");
    let response = await axios.get(`https://cors-anywhere.herokuapp.com/${urlApiTeams}`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response;
    console.log(results);
    renderResults1(results);
  }

  async function getAllClubDetails(id) {
    console.log("Api Club Details Call");
    window.location.href = `details.html?id=${id}`;
  }

  function renderResults1(results) {
    let data = results.data.teams;

    //Creating a DIV that contains all the different teams and which is appended to the DOM at the end of the function
    let teamsCL = document.createElement("div");
    teamsCL.setAttribute("id", "teamsCL");

    let i = 0;
    for (key in data) {
      //retrieve key information from API -> LOGO + TEAM ID + TEAM NAME
      let tempLogo = results.data.teams[i].crestUrl;
      let tempID = results.data.teams[i].id;
      let shortName = results.data.teams[i].shortName;

      //If no teamlogo available, replace with stock logo
      if (!tempLogo) {
        tempLogo = "images/plain_logo.jpg";
      }

      //Create DIV element that contains all information of a specific team
      let teamDiv = document.createElement("div");
      teamDiv.setAttribute("class", "teaminfo");
      teamDiv.setAttribute("uniqueID", tempID);

      //Create IMG element that contains team logo + onerror attribute that prevents empty logo if url loading fails
      let imgThumb = document.createElement("img");
      imgThumb.setAttribute("src", tempLogo);
      imgThumb.setAttribute("class", "clubLogo");
      imgThumb.setAttribute("onerror", `this.src="images/plain_logo.jpg";`);
      teamDiv.appendChild(imgThumb);

      //Create P element that has teamname in it
      let teamTitle = document.createElement("p");
      teamTitle.setAttribute("class", "teamname");
      teamTitle.innerHTML = shortName;
      teamDiv.appendChild(teamTitle);

      //Append IMG + Teamname to the teamDiv element
      teamsCL.appendChild(teamDiv);

      i++;
    }

    //Remove loading ripple animation and replace with div that contains all team information
    loader.classList.remove("lds-ripple");
    logoField.appendChild(teamsCL);
  }

  function goGoGo(evt) {
    console.log(evt);
    console.log(evt.target.getAttribute("uniqueID"));
    let id = evt.target.getAttribute("uniqueID");
    getAllClubDetails(id)
  }

  setInterval(function () {
    let num = Math.floor(Math.random() * 6 + 1);
    background.setAttribute("class", `background${num}`);
  }, 5000)

} //DON'T REMOVE = SCRIPT ELEMENT TO DEFINE HTML PAGE


/*
########## DETAILSPAGE ##########
*/

if (checkPageAttribute === "detailsPage") {

  let clubLogo = document.querySelector("#clubLogo");
  let clubName = document.querySelector("#clubName");
  let clubShortName = document.querySelector("#shortName");

  window.onload = function () {
    let url = document.location.href;
    console.log(url);
    
    let params = url.split("=");
    console.log(params);

    let id = params[1];
    console.log(id);
    getAllClubDetails(id);
}

  async function getAllClubDetails(id) {
    console.log("Api Club Call");
    let teamID = id;
    let response = await axios.get(`https://cors-anywhere.herokuapp.com/${urlApiClubs}${teamID}`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response;
    console.log(results);
    processDetails(results);
  }

  function processDetails(clubDetails) {
    console.log(clubDetails.data);
    let data = clubDetails.data;

    let address = data.address;
    let logoURL = data.crestUrl;
    let founded = data.founded;
    let name = data.name;
    let shortName = data.shortName;
    let stadium = data.venue;
    let website = data.website;
    let squad = data.squad;

    clubLogo.setAttribute("src", logoURL);
    let link = `<a href=${website}>${name}</a>`;
    clubName.innerHTML = link;
    clubShortName.innerHTML = `(${shortName})`;

  }




  
} //DON'T REMOVE = SCRIPT ELEMENT TO DEFINE HTML PAGE
