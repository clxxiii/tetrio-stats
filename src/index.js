const rankImage = document.getElementById("rankImage");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const userProfile = document.getElementById("userProfile");
const globalRank = document.getElementById("globalRank");

const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api?user=";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();
let testjson = {"success":true,"data":{"user":{"_id":"5e7a392fe55cb634a81b6127","username":"clxxiii","role":"user","ts":"2020-03-24T16:45:35.429Z","badges":[{"id":"secretgrade","label":"Achieved the full Secret Grade","ts":"2020-05-12T18:33:53.123Z"}],"xp":2112558,"gamesplayed":1875,"gameswon":539,"gametime":651885.3227955549,"country":"US","supporter":false,"supporter_tier":0,"verified":false,"league":{"gamesplayed":508,"gameswon":259,"rating":20424.231455449248,"glicko":1892.7417023783034,"rd":70.53631116493088,"rank":"s+","apm":34.17,"pps":1.45,"vs":75.09,"decaying":false,"standing":4616,"percentile":0.14529483990806913,"standing_local":1008,"prev_rank":"s","prev_at":5399,"next_rank":"ss","next_at":3494,"percentile_rank":"s+"},"avatar_revision":1618002894086,"banner_revision":1618610003550,"bio":"**Hi I play osu**","friend_count":46}},"cache":{"status":"hit","cached_at":1634709090901,"cached_until":1634709390901}}

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
  try {
    let currentJson = JSON.parse(localStorage.getItem("tetrioStatsUserData"))
    // Set cache time to 0 if no call has been stored yet
    if (currentJson == null) currentJson = { "data":{"user":{"username": 0}}, "cache":{"cached_until": 0} }
    let user = urlParams.get("user");
    // Only make a call if the current data is outdated
    console.log("Caching Information: " + currentJson.cache.cached_until + " > " + callTime)
    if (currentJson.data.user.username == user && currentJson.cache.cached_until > callTime) { console.log("using cached data"); return currentJson  }
    else {
      let params = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
      let response = await fetch(API_URL + user, params)
      response = await response.json();
      localStorage.setItem("tetrioStatsUserData", JSON.stringify(response));

      return response;
      }
    }
    catch (error) {
      localStorage.removeItem("tetrioStatsUserData");
    }
  }


}
async function updateData() {
  let json = await getUserData();
  try {
  console.log(json)
    let userRank = json.data.user.league.rank;
    userProfile.setAttribute("src", "https://tetr.io/user-content/avatars/" + json.data.user._id + ".jpg?rv=" + json.data.user.avatar_revision )
    rankImage.setAttribute("src", `src/ranks/` + userRank + `.png`);
    userName.innerHTML = json.data.user.username;
    userTR.innerHTML = (Math.round(json.data.user.league.rating * 10) ) / 10;
    globalRank.innerHTML = "#" + json.data.user.league.standing;
  }
  catch (error) {
    localStorage.removeItem("tetrioStatsUserData");
  }
}

function logData() {
  console.log(localStorage.getItem("tetrioStatsUserData"))
}
