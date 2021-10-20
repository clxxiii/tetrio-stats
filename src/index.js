const rankImage = document.getElementById("rankImage");
const main = document.getElementById("main");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const userProfile = document.getElementById("userProfile");
const globalRank = document.getElementById("globalRank");
const nameRankTR = document.getElementById("nameRankTR");

const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api?user=";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();
let testjson = {"success":true,"data":{"user":{"_id":"5e7783c830fb9028f9944a28","username":"btmc","role":"user","ts":"2020-03-22T15:27:04.304Z","badges":[{"id":"infdev","label":"Participated as tester in the INFDEV development phase"},{"id":"secretgrade","label":"Achieved the full Secret Grade","ts":"2020-05-04T17:23:00.939Z"},{"id":"kod_founder","label":"KO'd the founder of TETR.IO","ts":"2020-08-18T17:51:06.287Z"},{"id":"early-supporter","label":"Early Supporter"},{"id":"100player","label":"Emerged victorious in a 100+ player game","ts":"2021-04-01T17:56:51.937Z"}],"xp":946171,"gamesplayed":875,"gameswon":249,"gametime":262298.74007055536,"country":"IM","supporter":true,"supporter_tier":3,"verified":true,"league":{"gamesplayed":349,"gameswon":180,"rating":20625.26305573843,"glicko":1906.3737332751252,"rd":93.47929579936012,"rank":"s+","apm":37.19,"pps":1.25,"vs":80.13,"decaying":true,"standing":4345,"percentile":0.1361286076901382,"standing_local":7,"prev_rank":"s","prev_at":5424,"next_rank":"ss","next_at":3511,"percentile_rank":"s+"},"friend_count":136}},"cache":{"status":"miss","cached_at":1634738990483,"cached_until":1634739290483}}

let user = urlParams.get("user");
const rankColors = {
  "d": "#856C84",
  "d+": "#815880",
  "c-": "#6C417C",
  "c": "#67287B",
  "c+": "#522278",
  "b-": "#5949BE",
  "b": "#4357B5",
  "b+": "#4880B2",
  "a-": "#35AA8C",
  "a": "#3EA750",
  "a+": "#43b536",
  "s-": "#B79E2B",
  "s": "#d19e26",
  "s+": "#dbaf37",
  "ss": "#e39d3b",
  "u": "#c75c2e",
  "x": "#b852bf",
  "z": "#828282",
};

async function getUserData() {
  try {
    let currentJson = JSON.parse(localStorage.getItem("tetrioStatsUserData-" + user))
    // Set cache time to 0 if no call has been stored yet
    if (currentJson == null) currentJson = { "data":{"user":{"username": 0}}, "cache":{"cached_until": 0} }
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
      localStorage.setItem("tetrioStatsUserData-" + user, JSON.stringify(response));

      return response;
      }
    }
    catch (error) {
      localStorage.removeItem("tetrioStatsUserData-" + user);
    }
  }

async function updateData() {
  let json = await getUserData();
  // let json = testjson;
  try {
    console.log(json)
    nameRankTR.style.filter = "blur(0px)";
    let userRank = json.data.user.league.rank;
    main.style.background = rankColors[userRank]
    if (!(json.data.user.avatar_revision == undefined)) {
      userProfile.setAttribute("src", "https://tetr.io/user-content/avatars/" + json.data.user._id + ".jpg?rv=" + json.data.user.avatar_revision )
    }
    else { userProfile.style.width = 0; }
    rankImage.setAttribute("src", `src/ranks/` + userRank + `.png`);
    userName.innerHTML = json.data.user.username;
    userTR.innerHTML = (Math.round(json.data.user.league.rating * 10) ) / 10 + "<span id=subscript><sub>TR </sub></span>";
    globalRank.innerHTML = "#" + json.data.user.league.standing;
  }
  catch (error) {
    localStorage.removeItem("tetrioStatsUserData-" + user);
  }
}

function logData() {
  console.log(localStorage.getItem("tetrioStatsUserData-" + user))
}
