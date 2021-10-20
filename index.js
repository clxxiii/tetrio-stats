const rankImage = document.getElementById("rankImage");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();

const rankColors = {
  "D": "",
  "D+": "",
  "C-": "",
  "C": "",
  "C+": "",
  "B-": "",
  "B": "",
  "B+": "",
  "A-": "",
  "A": "",
  "A+": "",
  "S-": "",
  "S": "",
  "S+": "",
  "SS": "",
  "U": "",
  "X": "",
  "Z": "",
};
async function getUserData() {
  let currentJson = JSON.parse(localStorage.getItem("tetrioStatsUserData"))
  // Set cache time to 0 if no call has been stored yet
  if (currentJson == null) {currentJson = {"cache":{"cached_until": 0}} }
  // Only make a call if the current data is outdated
  console.log("Caching Information: " + currentJson.cache.cached_until + " > " + callTime)
  if (currentJson.cache.cached_until > callTime) { console.log("using cached data"); return currentJson  }
  else {
    let user = urlParams.get("user");

    let params = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    let response = await fetch(API_URL, params)
    response = await response.json();
    localStorage.setItem("tetrioStatsUserData", JSON.stringify(response));

    return response;
  }


}
async function updateData() {
  let json = await getUserData();
  console.log(json)
  let userRank = json.data.user.league.rank;
  rankImage.setAttribute("src", `src/ranks/` + userRank + `.png`);
  userName.innerHTML = json.data.user.username;
  userTR.innerHTML = (Math.round(json.data.user.league.rating * 10) ) / 10

  console.log(new Date().getTime())
}

function logData() {
  console.log(localStorage.getItem("tetrioStatsUserData"))
}
