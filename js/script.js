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
  let randomDetails = document.querySelector("#randomDetails");
  let venue = document.querySelector("#venue");
  let established = document.querySelector("#founded");
  let competitions = document.querySelector("#competitions");
  let detailsOverview = document.querySelector("#details-overview");
  let qualifiers = document.querySelector("#qualifiers")
  let groupStage = document.querySelector("#group-stage-progress");
  let knockOut = document.querySelector("#knock-out-progress");
  let final = document.querySelector("#final-progress");


  window.onload = function () {
    let url = document.location.href;
    let params = url.split("=");
    let id = params[1];
    getAllClubDetails(id);
    getAllMatches(id);
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
    // console.log(results);
    processDetails(results);
  }

  async function getAllMatches(id) {
    console.log("Api Matches Call");
    let teamID = id;
    let response = await axios.get(`https://api.football-data.org/v2/teams/${teamID}/matches/`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response;
    processMatches(results);
  }

  function processDetails(clubDetails) {
    let data = clubDetails.data;

    let address = data.address;
    let logoURL = data.crestUrl;
    let founded = data.founded;
    let name = data.name;
    let shortName = data.shortName;
    let stadium = data.venue;
    let website = data.website;
    let squad = data.squad;
    let compActive = data.activeCompetitions;

    clubLogo.setAttribute("src", logoURL);
    let link = `<a href=${website}>${name}</a>`;
    clubName.innerHTML = link;
    clubShortName.innerHTML = `(${shortName})`;

    venue.innerHTML = `Stadium: ${stadium}`;
    established.innerHTML = `Founded: ${founded}`;

    showCompetitions(compActive);
    showPlayerDetails(squad);
  }

  function showCompetitions(comp) {
    for (let i = 0; i < comp.length; i++) {
      let div = document.createElement("div");
      div.setAttribute("class", "competitions");
      div.innerHTML = `${comp[i].name}`;
      randomDetails.appendChild(div);
    }
  }

  function showPlayerDetails(squad) {
    let squadOverview = document.createElement("ul");
    let manager = `${squad[squad.length - 1].name}`;
    let role = `${squad[squad.length -1].role}`;
    let tempManager = document.createElement("li");
    tempManager.innerHTML = `${manager} - ${role}`;
    squadOverview.appendChild(tempManager);

    for (let i = 0; i < squad.length -1; i++) {
      let tempList = document.createElement("li");
      tempList.innerHTML = squad[i].name;
      tempList.innerHTML += " - ";
      tempList.innerHTML += squad[i].position;
      squadOverview.appendChild(tempList);
    }
    detailsOverview.appendChild(squadOverview);
  }

  function processMatches(results) {
    let matches = results.data.matches;
    console.log(matches);
    console.log(matches.length);
    let clArrayMatches = [];
    let clArrayQuali = [];
    let clArrayGroup = [];
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].competition.name === "UEFA Champions League") {
        clArrayMatches.push(matches[i]);
        if (/QUALIFYING_ROUND$/.test(matches[i].stage) || matches[i].stage === "PLAY_OFF_ROUND") {
          clArrayQuali.push(matches[i]);
        }
        else if (matches[i].stage === "GROUP_STAGE") {
          clArrayGroup.push(matches[i]);
        }
      }
    }
    console.log(clArrayMatches);
    console.log(clArrayQuali);
    console.log(clArrayGroup);

    processQualifiers(clArrayQuali);
    
  }

  function processQualifiers(matches) {
    console.log(matches);
    for (let i = 0; i < matches.length; i++) {
      let stage = matches[i].stage;
      let matchDate = matches[i].utcDate;
      let homeTeam = matches[i].homeTeam.name;
      let awayTeam = matches[i].awayTeam.name;
      let homeScore = matches[i].score.fullTime.homeTeam;
      let awayScore = matches[i].score.fullTime.awayTeam;
      console.log(`${stage} + ${matchDate} + ${homeTeam} + ${homeScore} + ${awayScore} + ${awayTeam}`);

      let matchOfTheDay = document.createElement("div");
      matchOfTheDay.setAttribute("class", "dailyMatch");
      stage = stage.split("_").join(" ");

      let stageTitle = document.createElement("h4");
      stageTitle.innerHTML = stage;
      matchOfTheDay.appendChild(stageTitle);

      matchDate = matchDate.split("T");
      matchDate = matchDate[0];

      let date = document.createElement("p");
      date.setAttribute("class", "teamDate");
      date.innerHTML = matchDate;
      matchOfTheDay.appendChild(date);

      let teams = document.createElement("div");
      teams.setAttribute("class", "teams");

      let homeTeamDiv = document.createElement("div");
      homeTeamDiv.setAttribute("class", "homeTeam");
      let homeTeamName = document.createElement("div");
      homeTeamName.innerHTML = homeTeam;
      let homeTeamScore = document.createElement("div");
      homeTeamScore.innerHTML = homeScore;
      homeTeamDiv.appendChild(homeTeamName);
      homeTeamDiv.appendChild(homeTeamScore);
      teams.appendChild(homeTeamDiv);

      let awayTeamDiv = document.createElement("div");
      awayTeamDiv.setAttribute("class", "awayTeam");
      let awayTeamName = document.createElement("div");
      awayTeamName.innerHTML = awayTeam;
      let awayTeamScore = document.createElement("div");
      awayTeamScore.innerHTML = awayScore;
      awayTeamDiv.appendChild(awayTeamName);
      awayTeamDiv.appendChild(awayTeamScore);
      teams.appendChild(awayTeamDiv);
      
      matchOfTheDay.appendChild(teams);
      qualifiers.appendChild(matchOfTheDay);
    }
    
  }

  
} //DON'T REMOVE = SCRIPT ELEMENT TO DEFINE HTML PAGE
