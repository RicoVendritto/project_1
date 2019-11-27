let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApiCL = "https://api.football-data.org/v2/competitions/CL/matches";
let urlApiTeams = "https://api.football-data.org/v2/competitions/CL/teams";
let urlApiClubs = "https://api.football-data.org/v2/teams/";
let urlApiMatch = "https://api.football-data.org/v2/matches/";
let checkPage = document.querySelector("body");
let checkPageAttribute = checkPage.getAttribute("data-title");
let heorkuapp = "https://cors-anywhere.herokuapp.com/"
// let unsplashAccessKey = "2d29cb7d7c65817ea67ddca64f1129e03a6fd4bf7096ac91005ecaf81a6c085f";
// let unsplashSecretKey = "339bec64b97398f6ba376cc1575b4bdd01f54e4c234a7c830199b6a89581593a";
// let unsplashEndPoint = "https://source.unsplash.com/featured/?";
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
  const footerTitle = document.querySelector("#teamName");

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
    let favoritesOrdered = favorites.sort((a, b) => (a.shortName > b.shortName) ? 1 : -1);
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
    getLocalStorage();
  }

  //RETRIEVE SAVED FAVORITE
  function getLocalStorage() {
    let favorite = JSON.parse(window.localStorage.getItem('favorite'));
    let id = favorite.id;
    let teamName = favorite.team;
    if (favorite.team !== "Favorite Team") {
      retrieveFavoriteInfo(id, teamName);
    }
  }

  //RETRIEVE LATEST FIXTURES FAVORITE TEAM
  async function retrieveFavoriteInfo(id, teamName) {
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
    processFavoriteResults(resultsArray, teamName);
  }

  //PROCESS LATEST DETAILS FAVORITE TEAM
  function processFavoriteResults(results, teamName) {
    footer.innerHTML = "";
    footerTitle.innerHTML = `Last results your team, <span id=favTeam>${teamName}</span>:`;
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
  qualifiers.addEventListener("click", showMatchDetails);
  let groupStage = document.querySelector("#group-stage-progress");
  groupStage.addEventListener("click", showMatchDetails);
  let knockOut = document.querySelector("#knock-out-progress");
  knockOut.addEventListener("click", showMatchDetails);
  let final = document.querySelector("#final-progress");
  final.addEventListener("click", showMatchDetails);
  let overlay = document.querySelector("#overlay");
  let overlayDetails = document.querySelector("#overlayDetails");
  let closeButton = document.querySelector("#closeButton");
  closeButton.addEventListener("click", overlayOff);

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
    established.innerHTML = `Founded: ${founded}`;

    showCompetitions(compActive);
    showPlayerDetails(squad);
    // setLayout(colors);
    // relevantPhoto(shortName);
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
    let clArrayKnockOut = [];
    let clArrayFinal = [];
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].competition.name === "UEFA Champions League") {
        clArrayMatches.push(matches[i]);
        if (/QUALIFYING_ROUND$/.test(matches[i].stage) || matches[i].stage === "PLAY_OFF_ROUND") {
          clArrayQuali.push(matches[i]);
        }
        else if (matches[i].stage === "GROUP_STAGE") {
          clArrayGroup.push(matches[i]);
        }
        else if (matches[i].stage === "ROUND_OF_16" || matches[i].stage === "QUARTER_FINALS") {
          clArrayKnockOut.push(matches[i]);
        } else if (matches[i].stage === "SEMI_FINALS" || matches[i].stage === "FINAL") {
          clArrayFinal.push(matches[i]); 
        }
      }
    }

    // ###### POSSIBLE STAGES OF THE TOURNAMENT ######
    // "1ST_QUALIFYING_ROUND",
    // "2ND_QUALIFYING_ROUND",
    // "3RD_QUALIFYING_ROUND",
    // "PLAY_OFF_ROUND",
    // "GROUP_STAGE",
    // "ROUND_OF_16",
    // "QUARTER_FINALS",
    // "SEMI_FINALS",
    // "FINAL"

    renderMatches(clArrayQuali, qualifiers);
    renderMatches(clArrayGroup, groupStage);
    renderMatches(clArrayKnockOut, knockOut);
    renderMatches(clArrayFinal, final);
  }

  function renderMatches(matches, fieldOutput) {
    // console.log(matches);
    for (let i = 0; i < matches.length; i++) {
      // console.log(matches);
      let matchId = matches[i].id;
      let stage = matches[i].stage;
      let matchDate = matches[i].utcDate;
      let homeTeam = matches[i].homeTeam.name;
      let awayTeam = matches[i].awayTeam.name;
      let homeScore = matches[i].score.fullTime.homeTeam;
      let awayScore = matches[i].score.fullTime.awayTeam;
      // console.log(`${stage} + ${matchDate} + ${homeTeam} + ${homeScore} + ${awayScore} + ${awayTeam}`);

      let matchOfTheDay = document.createElement("div");
      matchOfTheDay.setAttribute("class", "dailyMatch");
      matchOfTheDay.setAttribute("gameID", matchId);
      stage = stage.split("_").join(" ");

      let stageTitle = document.createElement("h4");
      stageTitle.setAttribute("gameID", matchId);
      stageTitle.innerHTML = stage;
      matchOfTheDay.appendChild(stageTitle);

      matchDate = matchDate.split("T");
      matchDate = matchDate[0];

      let date = document.createElement("p");
      date.setAttribute("gameID", matchId);
      date.setAttribute("class", "teamDate");
      date.innerHTML = matchDate;
      matchOfTheDay.appendChild(date);

      let teams = document.createElement("div");
      teams.setAttribute("gameID", matchId);
      teams.setAttribute("class", "teams");

      let homeTeamDiv = document.createElement("div");
      homeTeamDiv.setAttribute("gameID", matchId);
      homeTeamDiv.setAttribute("class", "homeTeam");
      let homeTeamName = document.createElement("div");
      homeTeamName.setAttribute("gameID", matchId);
      homeTeamName.innerHTML = homeTeam;
      let homeTeamScore = document.createElement("div");
      homeTeamScore.setAttribute("gameID", matchId);
      homeTeamScore.innerHTML = homeScore;
      homeTeamDiv.appendChild(homeTeamName);
      homeTeamDiv.appendChild(homeTeamScore);
      teams.appendChild(homeTeamDiv);

      let awayTeamDiv = document.createElement("div");
      awayTeamDiv.setAttribute("gameID", matchId);
      awayTeamDiv.setAttribute("class", "awayTeam");
      let awayTeamName = document.createElement("div");
      awayTeamName.setAttribute("gameID", matchId);
      awayTeamName.innerHTML = awayTeam;
      let awayTeamScore = document.createElement("div");
      awayTeamScore.setAttribute("gameID", matchId);
      awayTeamScore.innerHTML = awayScore;
      awayTeamDiv.appendChild(awayTeamName);
      awayTeamDiv.appendChild(awayTeamScore);
      teams.appendChild(awayTeamDiv);
      
      matchOfTheDay.appendChild(teams);
      fieldOutput.setAttribute("gameID", matchId);
      fieldOutput.appendChild(matchOfTheDay);
    }
  }

  async function showMatchDetails(id) {
    let teamID = id.target.getAttribute("gameID");
    let response = await axios.get(`${urlApiMatch}${teamID}`, {
      headers: {
        'X-Auth-Token': api_key
      }
    });
    const results = response.data.match;
    renderMatchDetails(results)
  }

  function renderMatchDetails(details) {
    console.log(details);
    overlayDetails.innerHTML = "";
    overlayOn();
    let competitionName = details.competition.name;
    let stage = details.stage;
    stage = stage.split("_").join(" ");
    stage = stage.toLowerCase();
    let competitionGroup = details.group;
    let venue = details.venue;
    let matchDate = details.utcDate;
    matchDate = matchDate.split("T");
    matchDate = matchDate[0];
    matchDate = matchDate.split("-").reverse();
    matchDate = matchDate.join("-");
    let referees = details.referees;
    let refArray = [];
    referees.forEach(ref => {
      refArray.push(ref.name);
    })
    let homeTeam = details.homeTeam.name;
    let awayTeam = details.awayTeam.name;
    let scoreExtraTime = details.score.extraTime;
    let scoreFullTime = details.score.fullTime;
    let scoreHalfTime = details.score.halfTime;
    let scorePenalties = details.score.penalties;
    let scoreWinner = details.score.winner;

    let matchDetailsOverview = document.createElement("div");
    matchDetailsOverview.classList.add("matchDetailsOverlay");
    let competitionHeader = document.createElement("h2");
    competitionHeader.innerHTML = competitionName;

    let matchGeneralInfo = document.createElement("div");
    matchGeneralInfo.classList.add("matchGeneralInfo");

    let competitionStage = document.createElement("div");
    competitionStage.classList.add("competitionStage");
    competitionStage.innerHTML = stage;
    if (competitionGroup !== null) {
      competitionStage.innerHTML += " - " + competitionGroup;
    }
    
    let gameDate = document.createElement("div");
    gameDate.innerHTML = matchDate;

    let gameVenue = document.createElement("div");
    gameVenue.innerHTML = venue;

    matchGeneralInfo.appendChild(competitionStage);
    matchGeneralInfo.appendChild(gameDate);
    matchGeneralInfo.appendChild(gameVenue);

    let gameRef = document.createElement("div");
    gameRef.classList.add("gameRef");
    let refTitle = document.createElement("div");
    refTitle.classList.add("refTitle");
    refTitle.innerHTML = "Referees";
    let refNames = document.createElement("div");
    refNames.classList.add("refNames");
    refArray.forEach(name => {
      refNames.innerHTML += "<div>"+name+"<div>";
    })

    gameRef.appendChild(refTitle);
    gameRef.appendChild(refNames);

    let gameTeams = document.createElement("div");
    gameTeams.classList.add("gameTeams");
    let homeTeamDiv = document.createElement("div");
    homeTeamDiv.innerHTML = homeTeam;
    let awayTeamDiv = document.createElement("div");
    awayTeamDiv.innerHTML = awayTeam;
    gameTeams.appendChild(homeTeamDiv);
    gameTeams.appendChild(awayTeamDiv);

    

    matchDetailsOverview.appendChild(competitionHeader);
    matchDetailsOverview.appendChild(matchGeneralInfo);
    matchDetailsOverview.appendChild(gameRef);
    matchDetailsOverview.appendChild(gameTeams);
    overlayDetails.appendChild(matchDetailsOverview);
  }

  function overlayOn() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function overlayOff() {
    document.getElementById("overlay").style.display = "none";
  }
  // async function relevantPhoto(name) {
  //   let searchKey = name;
  //   let response = await axios.get(`${unsplashEndPoint}${searchKey}`, {
  //     headers: {
  //       'Authorization': unsplashAccessKey
  //     }
  //   });
  //   const results = response;
  //   console.log(results);
  // }


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
