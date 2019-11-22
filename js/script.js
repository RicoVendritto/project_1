let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApiCL = "https://api.football-data.org/v2/competitions/CL/matches";
let urlApiTeams = "https://api.football-data.org/v2/competitions/CL/teams";
let urlApiClubs = "https://api.football-data.org/v2/teams/";

const button = document.querySelector("#grabInput");
button.addEventListener("click", processApi);
const logoDiv = document.querySelector(".logo");
const logoField = document.querySelector("#teamsCL");

function processApi(evt) {
  evt.preventDefault();
  getAllCompetitions();
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

async function getAllCompetitions(evt) {
  console.log("Api CL Call");
  let response = await axios.get(`https://cors-anywhere.herokuapp.com/${urlApiCL}`, {
    headers: {
      'X-Auth-Token': api_key
    }
  });
  const results = response;
  console.log(results);
}

async function getAllClubDetails(evt) {
  console.log("Api Club Call");
  let teamID = 678;
  let response = await axios.get(`https://cors-anywhere.herokuapp.com/${urlApiClubs}${teamID}`, {
    headers: {
      'X-Auth-Token': api_key
    }
  });
  const results = response;
  renderResults2(results);
}

function renderResults1(results) {
  let data = results.data.teams;
  let i = 0;
  for (key in data) {
    let tempLogo = results.data.teams[i].crestUrl;
    let tempID = results.data.teams[i].id;
    console.log(`${tempLogo} -- ${tempID}`);

    if (!tempLogo) {
      tempLogo = "images/plain_logo.jpg";
    }

    let imgThumb = document.createElement("img");
    imgThumb.setAttribute("src", tempLogo);
    imgThumb.setAttribute("uniqueID", tempID);
    imgThumb.setAttribute("class", "clubLogo");
    logoField.appendChild(imgThumb);

    i++;
  }
}

function renderResults2(results) {
  console.log(results);
  let logo = results.data.crestUrl;
  console.log(logo);

  let imgLogo = document.createElement("img");
  imgLogo.setAttribute("src", "images/plain_logo.jpg");
  imgLogo.setAttribute("class", "teamLogo");
  logoDiv.appendChild(imgLogo);
}