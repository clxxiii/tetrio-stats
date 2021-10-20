const rankImage = document.getElementById("rankImage");
const main = document.getElementById("main");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const userProfile = document.getElementById("userProfile");
const globalRank = document.getElementById("globalRank");

const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api?user=";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();
let testjson = {"success":true,"data":{"user":{"_id":"6076577db88e696ebeb54ba7","username":"themonkifier","role":"user","ts":"2021-04-14T02:46:21.716Z","badges":[],"xp":1086107,"gamesplayed":469,"gameswon":206,"gametime":202970.15600000013,"country":"US","supporter_tier":0,"verified":false,"league":{"gamesplayed":282,"gameswon":154,"rating":21448.868415521607,"glicko":1971.020337900401,"rd":62.39632916600284,"rank":"ss","apm":43.17,"pps":1.36,"vs":90.48,"decaying":false,"standing":3455,"percentile":0.10830302270161796,"standing_local":774,"prev_rank":"s+","prev_at":3508,"next_rank":"u","next_at":1595,"percentile_rank":"ss"},"avatar_revision":1621951855974,"friend_count":5}},"cache":{"status":"miss","cached_at":1634736913287,"cached_until":1634737213287}}

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

async function updateData() {
  let json = await getUserData();

  try {
    console.log(json)
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
    localStorage.removeItem("tetrioStatsUserData");
  }
}

function logData() {
  console.log(localStorage.getItem("tetrioStatsUserData"))
}
