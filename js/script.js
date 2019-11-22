let api_key = "5a350e1523814ab9b993eb2dbb85f264";
let urlApi = "http://api.football-data.org/v2/competitions";

const button = document.querySelector("#grabInput");
button.addEventListener("click", processApi);

function processApi(evt) {
  evt.preventDefault();
  getAllCompetitions();
}

async function getAllCompetitions(evt) {
  console.log("Api call");
  let response = await axios.get("https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/competitions/CL/matches", {
    headers: {
      'X-Auth-Token': api_key
    }
  });
  const results = response;
  renderResults(results);
}

function renderResults(results) {
  console.log(results);
}
