let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApiCL = "https://api.football-data.org/v2/competitions/CL/matches";
let urlApiTeams = "https://api.football-data.org/v2/competitions/CL/teams";
let urlApiClubs = "https://api.football-data.org/v2/teams/";
let urlApiMatch = "https://api.football-data.org/v2/matches/";
let checkPage = document.querySelector("body");
let checkPageAttribute = checkPage.getAttribute("data-title");
let heorkuapp = "https://cors-anywhere.herokuapp.com/"
let newsApiUrl = "https://newsapi.org/v2/everything?q=";
let newsApiKey = "&language=en&sortBy=popularity&apiKey=435facf767354bfebae88c73975746e7";

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
    if (selection.text !== "Choose Team") {
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
  function getAllClubDetails(id) {
    window.location.href = `details.html?id=${id}`;
  }

  //REDERS RESULTS FROM THE OVERVIEWTEAMS FUNCTION
  function renderResults1(results) {
    let data = results.data.teams;

    //Creating a DIV that contains all the different teams and which is appended to the DOM at the end of the function
    let teamsCL = document.createElement("div");
    teamsCL.setAttribute("id", "teamsCL");
    teamsCL.addEventListener("click", goGoGo);
    teamsCL.addEventListener("touchend", goGoGo, false);

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
      imgThumb.setAttribute("uniqueID", tempID);
      teamDiv.appendChild(imgThumb);

      //Create P element that has teamname in it
      let teamTitle = document.createElement("p");
      teamTitle.setAttribute("class", "teamname");
      teamTitle.setAttribute("uniqueID", tempID);
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
    console.log(evt);
    let id = evt.target.getAttribute("uniqueID");
    getAllClubDetails(id);
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

  //Triggers 2 functions that retrieve club and match details 
  //based on the ID which is extracted from the URL
  window.onload = function () {
    let url = document.location.href;
    let params = url.split("=");
    let id = params[1];
    getAllClubDetails(id);
    getAllMatches(id);
  }

  //Run api request to retrieve club details and pass through to process results
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

  //Run api request to retrieve match details of club and pass through to process
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

  //Process key information from the club to present on the page
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

    //Additional functions that run based on info that is extracted from
    //club information and to have it rendered nicely on the details page.
    showCompetitions(compActive);
    showPlayerDetails(squad);
    getLatestNews(name);
    // setLayout(colors);
    // relevantPhoto(shortName);
  }

  //Shows in which competitions the club is active (domestic & international)
  function showCompetitions(comp) {
    for (let i = 0; i < comp.length; i++) {
      let div = document.createElement("div");
      div.setAttribute("class", "competitions");
      div.innerHTML = `${comp[i].name}`;
      randomDetails.appendChild(div);
    }
  }

  //Renders a complete list of all the players and their role, plus the manager
  function showPlayerDetails(squad) {
    let squadOverview = document.createElement("ul");
    let manager = `${squad[squad.length - 1].name}`;
    let role = `${squad[squad.length - 1].role}`;
    role = role.split("_").join(" ").toLowerCase();
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

  //Renders an overview of all the matches so far played in the CL and the ones
  //that are still planned for this round including their opposition
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

    //One function can render all results based on the stage as 2 arguments
    //are passed to the function.
    renderMatches(clArrayQuali, qualifiers);
    renderMatches(clArrayGroup, groupStage);
    renderMatches(clArrayKnockOut, knockOut);
    renderMatches(clArrayFinal, final);
  }

  //Uses two parameters to process an array of matches and present them in
  //the correct output field on the page (pre-defined HTML elements)
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

  //API request that runs to present match details
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

  //Renders match details and makes them available in the overlay
  //Also triggers the overlay function to make this visible on the page.
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
    scoreWinner = scoreWinner.split("_").join(" ").toLowerCase();

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

    let matchScores = document.createElement("div");
    matchScores.classList.add("matchScores");
    let scores = document.createElement("div");
    scores.classList.add("scores");
    let extraTimeDiv = document.createElement("div");
    extraTimeDiv.classList.add("fixtures");
    if (scoreExtraTime.homeTeam !== null) {
      let extraTimeHomeTeam = document.createElement("div");
      extraTimeHomeTeam.innerHTML = scoreExtraTime.homeTeam;
      let extraTimeSep = document.createElement("div");
      extraTimeSep.innerHTML = " ET ";
      let extraTimeAwayTeam = document.createElement("div");
      extraTimeAwayTeam.innerHTML = scoreExtraTime.awayTeam;
    }
    
    let fullTimeDiv = document.createElement("div");
    fullTimeDiv.classList.add("fixtures");
    if (scoreFullTime.homeTeam !== null) {
      let fullTimeHomeTeam = document.createElement("div");
      fullTimeHomeTeam.innerHTML = scoreFullTime.homeTeam;
      fullTimeDiv.appendChild(fullTimeHomeTeam);
      let fullTimeSep = document.createElement("div");
      fullTimeSep.innerHTML = " FT ";
      fullTimeDiv.appendChild(fullTimeSep);
      let fullTimeAwayTeam = document.createElement("div");
      fullTimeAwayTeam.innerHTML = scoreFullTime.awayTeam;
      fullTimeDiv.appendChild(fullTimeAwayTeam);
    }

    let halfTimeDiv = document.createElement("div");
    halfTimeDiv.classList.add("fixtures");
    if (scoreHalfTime.homeTeam !== null) {
      let halfTimeHomeTeam = document.createElement("div");
      halfTimeHomeTeam.innerHTML = scoreHalfTime.homeTeam;
      halfTimeDiv.appendChild(halfTimeHomeTeam);
      let halfTimeSep = document.createElement("div");
      halfTimeSep.innerHTML = " HT ";
      halfTimeDiv.appendChild(halfTimeSep);
      let halfTimeAwayTeam = document.createElement("div");
      halfTimeAwayTeam.innerHTML = scoreHalfTime.awayTeam;
      halfTimeDiv.appendChild(halfTimeAwayTeam);
    }

    let penaltiesDiv = document.createElement("div");
    penaltiesDiv.classList.add("fixtures");
    if (scorePenalties.homeTeam !== null) {
      let penaltiesHomeTeam = document.createElement("div");
      penaltiesHomeTeam.innerHTML = scorePenalties.homeTeam;
      penaltiesDiv.appendChild(penaltiesHomeTeam);
      let penaltiesSep = document.createElement("div");
      penaltiesSep.innerHTML = " PT ";
      penaltiesDiv.appendChild(penaltiesSep);
      let penaltiesAwayTeam = document.createElement("div");
      penaltiesAwayTeam.innerHTML = scorePenalties.awayTeam;
      penaltiesDiv.appendChild(penaltiesAwayTeam);
    }

    let winnerDiv = document.createElement("div");
    winnerDiv.classList.add("fixtures");
    winnerDiv.innerHTML = scoreWinner;

    matchScores.appendChild(extraTimeDiv);
    matchScores.appendChild(fullTimeDiv);
    matchScores.appendChild(halfTimeDiv);
    matchScores.appendChild(penaltiesDiv);
    matchScores.appendChild(winnerDiv);

    matchDetailsOverview.appendChild(competitionHeader);
    matchDetailsOverview.appendChild(matchGeneralInfo);
    matchDetailsOverview.appendChild(gameRef);
    matchDetailsOverview.appendChild(gameTeams);
    matchDetailsOverview.appendChild(matchScores);
    overlayDetails.appendChild(matchDetailsOverview);
  }

  //Function to make overlay visible
  function overlayOn() {
    document.getElementById("overlay").style.display = "block";
  }
  
  //Function to make overlay invisible
  function overlayOff() {
    document.getElementById("overlay").style.display = "none";
  }

  //API request to retrieve latest news available based on clubname
  async function getLatestNews(club) {
    let teamName = `${club}%20Champions%20League`;
    // let teamName = club;
    console.log(teamName);
    let response = await axios.get(`${newsApiUrl}${teamName}${newsApiKey}`);
    const results = response.data.articles;
    renderArticles(results);
  }

  //Render results API News request and show last 3 articles including links
  //and background photos.
  function renderArticles(articles) {
    console.log(articles);
    for (let i = 0; i < 3; i++) {
      let articleTitle = articles[i].title;
      // let articleDesc = articles[i].description;
      let articleImage = articles[i].urlToImage;
      let articleUrl = articles[i].url;
      let articleSource = articles[i].source.name;

      let articleFrame = document.querySelector(`#articles${i}`);
      articleFrame.style.background = `url("${articleImage}")`;
      articleFrame.style.backgroundRepeat = "no-repeat";
      articleFrame.style.backgroundSize = "cover";

      let articleTitleDiv = document.createElement("div");
      articleTitleDiv.innerHTML = `<a href="${articleUrl}" target="_blank">${articleTitle}</a>`;
      articleFrame.appendChild(articleTitleDiv);

      let sourceFrame = document.querySelector(`#source${i}`);
      let sourceDiv = document.createElement("div");
      sourceDiv.innerHTML = `Source: ${articleSource} via newsapi.org`;
      sourceFrame.appendChild(sourceDiv);
    }
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