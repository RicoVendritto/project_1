let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApiCL = "https://api.football-data.org/v2/competitions/CL/matches";
let urlApiTeams = "https://api.football-data.org/v2/competitions/CL/teams";
let urlApiClubs = "https://api.football-data.org/v2/teams/";
let checkPage = document.querySelector("body");
let checkPageAttribute = checkPage.getAttribute("data-title");
let heorkuapp = "https://cors-anywhere.herokuapp.com/"
/*
########## HOMEPAGE ##########
*/

if (checkPageAttribute === "indexPage") {

  const logoField = document.querySelector(".main");
  const loader = document.querySelector(".lds-ripple");
  const background = document.querySelector("#backgroundIndex");
  const banner = document.querySelector("#banner");
  const favoriteList = document.querySelector("#teamList");
  const favButton = document.querySelector("#favButton");
  favButton.addEventListener("click", setFavorite);
  const footer = document.querySelector("#containerFooter");

  //TRIGGERS 2 FUNCTIONS TO FILL PAGE + BANNER ON WINDOW LOAD
  window.onload = function (evt) {
    evt.preventDefault();
    overviewTeams();
    getMatchesBanner();
    getLocalStorage();
  };

  //FILLS THE DROP DOWN FIELD OF FAVORITE TEAMS
  function fillFavoriteList(results) {
    let favorites = results.data.teams;
    let favoritesOrdered = favorites.sort((a, b) => (a.name > b.name) ? 1 : -1);
    let i = 0;
    for (keys in favoritesOrdered) {
      let shortName = favoritesOrdered[i].shortName;
      let tempID = favoritesOrdered[i].id;
      let option = document.createElement("option");
      option.setAttribute("id", tempID);
      option.innerHTML = shortName;
      favoriteList.appendChild(option);
      i++;
    }
  }

  //SAVE FAVORITE TO LOCAL STORAGE
  function setFavorite() {
    let selection = favoriteList[favoriteList.selectedIndex];
    if (selection.text !== "Favorite Team") {
      let name = selection.text;
      let identifier = selection.getAttribute("id");
      const favorite = { team: name, id: identifier };
      window.localStorage.setItem('favorite', JSON.stringify(favorite));
    }
  }

  //RETRIEVE SAVED FAVORITE
  function getLocalStorage() {
    let favorite = JSON.parse(window.localStorage.getItem('favorite'));
    let id = favorite.id;
    if (favorite.team !== "Favorite Team") {
      retrieveFavoriteInfo(id);
    }
  }

  //RETRIEVE LATEST FIXTURES FAVORITE TEAM
  async function retrieveFavoriteInfo(id) {
    let teamID = id;
    let response = await axios.get(`https://api.football-data.org/v2/teams/${teamID}/matches/`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response.data.matches;
    let resultsArray = [];
    for (let i = 1; resultsArray.length < 4; i++) {
      if (results[results.length - i].competition.name === "UEFA Champions League" && results[results.length - i].status === "FINISHED") {
        resultsArray.push(results[results.length - i]);
      }
    }
    processFavoriteResults(resultsArray);
  }

  //PROCESS LATEST DETAILS FAVORITE TEAM
  function processFavoriteResults(results) {
    results.forEach(results => {
      let homeName = results.homeTeam.name;
      let homeScore = results.score.fullTime.homeTeam;
      let awayName = results.awayTeam.name;
      let awayScore = results.score.fullTime.awayTeam;
      let stage = results.stage.split("_").join(" ");
      let date = results.utcDate.split("T");
      date = date[0];
      let resultsFavorite = document.createElement("div");
      let homeTeam = document.createElement("p");
      let awayTeam = document.createElement("p");
      homeTeam.innerHTML = `${homeScore} | ${homeName}`;
      awayTeam.innerHTML = `${awayScore} | ${awayName}`;
      resultsFavorite.appendChild(homeTeam);
      resultsFavorite.appendChild(awayTeam);
      footer.appendChild(resultsFavorite);
    }
    )
  }

  //RETRIEVES INFO FOR THE OVERVIEW OF CLUB ON THE FRONT PAGE
  async function overviewTeams() {
    let response = await axios.get(`${urlApiTeams}`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response;
    renderResults1(results);
    fillFavoriteList(results);
  }

  //TRIGGERED BY CLUB LOGO EVENT TRIGGER -> DIRECTS NEW PAGE AND PASSES ID VIA URL
  async function getAllClubDetails(id) {
    window.location.href = `details.html?id=${id}`;
  }

  //REDERS RESULTS FROM THE OVERVIEWTEAMS FUNCTION
  function renderResults1(results) {
    let data = results.data.teams;

    //Creating a DIV that contains all the different teams and which is appended to the DOM at the end of the function
    let teamsCL = document.createElement("div");
    teamsCL.setAttribute("id", "teamsCL");
    teamsCL.addEventListener("click", goGoGo);

    let i = 0;
    for (key in data) {
      //retrieve key information from API -> LOGO + TEAM ID + TEAM NAME
      let tempLogo = data[i].crestUrl;
      let tempID = data[i].id;
      let shortName = data[i].shortName;

      //If no teamlogo available, replace with stock logo
      if (!tempLogo) {
        tempLogo = "images/plain_logo.png";
      }

      //Create DIV element that contains all information of a specific team
      let teamDiv = document.createElement("div");
      teamDiv.setAttribute("class", "teaminfo");
      teamDiv.setAttribute("uniqueID", tempID);

      //Create IMG element that contains team logo + onerror attribute that prevents empty logo if url loading fails
      let imgThumb = document.createElement("img");
      imgThumb.setAttribute("src", tempLogo);
      imgThumb.setAttribute("class", "clubLogo");
      imgThumb.setAttribute("onerror", `this.src="images/plain_logo.png";`);
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

  //CLICK ON CLUB LOGO EVENT TRIGGER
  function goGoGo(evt) {
    let id = evt.target.getAttribute("uniqueID");
    getAllClubDetails(id)
  }

  //LOOPS THROUGH THE BACKGROUNDS
  setInterval(function () {
    let num = Math.floor(Math.random() * 6 + 1);
    background.setAttribute("class", `background${num}`);
  }, 10000)

  //RETRIEVES GAMES FOR THE BANNER
  async function getMatchesBanner() {
    let response = await axios.get(`https://api.football-data.org/v2/competitions/CL/matches/`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response.data.matches;
    checkBannerData(results);
  }

  //CREATES AN ARRAY OF THE LAST 30 GAMES PLAYED
  function checkBannerData(fixtures) {
    let checkedArray = [];
    let lengthArray = fixtures.length;
    for (let i = 1; checkedArray.length < 30; i++) {
      if (fixtures[lengthArray - i].status !== "SCHEDULED") {
        checkedArray.push(fixtures[lengthArray - i]);
      }
    }
    pushToBanner(checkedArray);
  }

  //PUSHES THE ARRAY OF LAST 30 GAMES TO THE BANNER
  function pushToBanner(fixtures) {
    let lA = fixtures.length;
    for (let i = 1; i < lA; i++) {
      let game = document.createElement("div");
      game.setAttribute("class", "bannerScore");
      
      let topBox = document.createElement("p");
      topBox.setAttribute("class", "teamBox");
      let bottomBox = document.createElement("p");
      bottomBox.setAttribute("class", "teamBox");

      let homeTeam = fixtures[lA - i].homeTeam.name;
      let homeScore = fixtures[lA - i].score.fullTime.homeTeam;

      topBox.innerHTML += homeScore;
      topBox.innerHTML += " | "+homeTeam;

      let awayTeam = fixtures[lA - i].awayTeam.name;
      let awayScore = fixtures[lA - i].score.fullTime.awayTeam;

      bottomBox.innerHTML += awayScore;
      bottomBox.innerHTML += " | "+awayTeam;
      
      game.appendChild(topBox);
      game.appendChild(bottomBox);

      banner.appendChild(game);
    }
  }

} //DON'T REMOVE = SCRIPT ELEMENT TO DEFINE HTML PAGE

/*
#################### DETAILSPAGE ####################
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
    let teamID = id;
    let response = await axios.get(`${urlApiClubs}${teamID}`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response;
    console.log(results);
    processDetails(results);
  }

  async function getAllMatches(id) {
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
    // console.log(address);
    //WHERE TO FIND THE CLUB
    let logoURL = data.crestUrl;
    let founded = data.founded;
    let name = data.name;
    let shortName = data.shortName;
    let stadium = data.venue;
    let website = data.website;
    let squad = data.squad;
    let compActive = data.activeCompetitions;
    let colors = data.clubColors;

    clubLogo.setAttribute("src", logoURL);
    clubLogo.setAttribute("onerror", `this.src="images/plain_logo.png";`);
    let link = `<a class="clubName" target="_blank" href=${website}>${name}</a>`;
    clubName.innerHTML = link;
    clubShortName.innerHTML = `(${shortName})`;

    address = address.split(" ").join("+");
    address = `https://www.google.com/maps/search/${address}`;
    address = `<a class="clubName" target="_blank" href=${address}>${stadium}</a>`;
    venue.innerHTML = `Stadium: ${address}`;
    // venue.innerHTML = `Stadium: <a class="venueLink" href=${address} target="_blank">${stadium}</a>`;
    established.innerHTML = `Founded: ${founded}`;

    showCompetitions(compActive);
    showPlayerDetails(squad);
    // setLayout(colors);
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
    squadOverview.innerHTML = "<p id='titleSquad'>SQUAD</p>";
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

    renderMatches(clArrayQuali, qualifiers);
    renderMatches(clArrayGroup, groupStage);
  }

  function renderMatches(matches, fieldOutput) {
    // console.log(matches);
    for (let i = 0; i < matches.length; i++) {
      let stage = matches[i].stage;
      let matchDate = matches[i].utcDate;
      let homeTeam = matches[i].homeTeam.name;
      let awayTeam = matches[i].awayTeam.name;
      let homeScore = matches[i].score.fullTime.homeTeam;
      let awayScore = matches[i].score.fullTime.awayTeam;
      // console.log(`${stage} + ${matchDate} + ${homeTeam} + ${homeScore} + ${awayScore} + ${awayTeam}`);

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
      fieldOutput.appendChild(matchOfTheDay);
    }
  }

  // function setLayout(colors) {
  //   colors = colors.split("/");
  //   console.log(colors);

  //   let color1 = colors[0].trim();
  //   color1 = color1.split(" ");
  //   color1 = color1[1];
    
  //   let color2 = colors[1].trim();
  //   color2 = color2.split(" ");
  //   color2 = color2[1];

  //   console.log(`|${color1}|`);
  //   console.log(`|${color2}|`);
    
  //   let headers = document.querySelectorAll(".clubName");
  //   headers.forEach(header => {
  //     header.style.color = color1;
  //   })
  //   // .style.color = color1;
  //   document.querySelector("#shortName").style.color = color1;
  //   document.querySelector("#randomDetails").style.background = color2;
  // }

} //DON'T REMOVE = SCRIPT ELEMENT TO DEFINE HTML PAGE
