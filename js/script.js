let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApiCL = "https://api.football-data.org/v2/competitions/CL/matches";
let urlApiTeams = "https://api.football-data.org/v2/competitions/CL/teams";
let urlApiClubs = "https://api.football-data.org/v2/teams/";

// const button = document.querySelector("#grabInput");
// button.addEventListener("click", processApi);
const logoDiv = document.querySelector(".logo");
// const logoField = document.querySelector("#teamsCL");
const logoField = document.querySelector(".main");
logoField.addEventListener("click", goGoGo);
const loader = document.querySelector(".lds-ripple");
const background = document.querySelector("#background");


function processApi(evt) {
  evt.preventDefault();
  // getAllCompetitions();
  getAllClubDetails();
}

window.onload = function () {
  overviewTeams();
};

async function overviewTeams(evt) {
  console.log("Api CL Call");
  let response = await axios.get(`https://cors-anywhere.herokuapp.com/${urlApiTeams}`, {
    headers: {
      'X-Auth-Token': api_key
    }
  });
  const results = response;
  console.log(results);
  renderResults1(results);
}

// async function getAllCompetitions() {
//   console.log("Api CL Call");
//   let response = await axios.get(`https://cors-anywhere.herokuapp.com/${urlApiCL}`, {
//     headers: {
//       'X-Auth-Token': api_key
//     }
//   });
//   const results = response;
//   console.log(results);
// }

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
}

function renderResults1(results) {
  let data = results.data.teams;
  // console.log(data);

  let teamsCL = document.createElement("div");
  teamsCL.setAttribute("id", "teamsCL");

  let i = 0;
  for (key in data) {
    let tempLogo = results.data.teams[i].crestUrl;
    let tempID = results.data.teams[i].id;
    let shortName = results.data.teams[i].shortName;
    // console.log(`${tempLogo} -- ${tempID} -- ${shortName}`);

    if (!tempLogo) {
      tempLogo = "images/plain_logo.jpg";
    }

    let teamDiv = document.createElement("div");
    teamDiv.setAttribute("class", "teaminfo");
    teamDiv.setAttribute("uniqueID", tempID);

    // onerror="this.src='default-image.jpg';" alt="Missing Image"

    let imgThumb = document.createElement("img");
    imgThumb.setAttribute("src", tempLogo);
    imgThumb.setAttribute("class", "clubLogo");
    imgThumb.setAttribute("onerror", `this.src="images/plain_logo.jpg";`);
    teamDiv.appendChild(imgThumb);

    let teamTitle = document.createElement("p");
    teamTitle.setAttribute("class", "teamname");
    teamTitle.innerHTML = shortName;
    teamDiv.appendChild(teamTitle);

    teamsCL.appendChild(teamDiv);

    i++;
  }

  loader.classList.remove("lds-ripple");
  logoField.appendChild(teamsCL);
}

// function renderResults2(results) {
//   console.log(results);
//   let logo = results.data.crestUrl;
//   console.log(logo);

//   let imgLogo = document.createElement("img");
//   imgLogo.setAttribute("src", "images/plain_logo.jpg");
//   imgLogo.setAttribute("class", "teamLogo");
//   logoDiv.appendChild(imgLogo);
// }

function goGoGo(evt) {
  console.log(evt);
  console.log(evt.target.getAttribute("uniqueID"));
  let id = evt.target.getAttribute("uniqueID");
  getAllClubDetails(id)
}

setInterval(function () {
  let testNum = 0;
  let num = Math.floor(Math.random() * 6 + 1);
  console.log(num);
  if (testNum === num) {
    num + 1;
  }
  
  testNum = num;
  background.setAttribute("class", `background${num}`);
}, 5000)