const rankImage = document.getElementById("rankImage");
const main = document.getElementById("main");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const userProfile = document.getElementById("userProfile");
const globalRank = document.getElementById("globalRank");
const nameRankTR = document.getElementById("nameRankTR");
const tr = document.getElementById("TR");
const apm = document.getElementById("apm");
const pps = document.getElementById("pps");
const vs = document.getElementById("vs");
const wl = document.getElementById("wl");
const stats = document.getElementById("stats");

const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api?user=";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();

const testjson = {"success":true,"data":{"user":{"_id":"607757ae8ce31d6ec6610f8a","username":"fgam3r","role":"user","ts":"2021-04-14T20:59:26.481Z","badges":[],"xp":990344,"gamesplayed":461,"gameswon":187,"gametime":285664.5182222221,"country":"NL","supporter_tier":0,"verified":false,"league":{"gamesplayed":332,"gameswon":175,"rating":10661.717322730039,"glicko":1422.2132067729272,"rd":70.700843752591,"rank":"a-","apm":20.6,"pps":0.96,"vs":42.31,"decaying":false,"standing":16504,"percentile":0.5212077187884913,"standing_local":97,"prev_rank":"b+","prev_at":17098,"next_rank":"a","next_at":14565,"percentile_rank":"a-"},"avatar_revision":1618475770146,"friend_count":12}},"cache":{"status":"miss","cached_at":1634758582092,"cached_until":1634758882092}}

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
    if (currentJson.cache.cached_until > callTime) { console.log("Using Cached Data"); return currentJson  }
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
  console.log(json)

  try {
    // Animation
    userProfile.style.filter = "opacity(100)";
    nameRankTR.style.gap = "4rem";
    userProfile.classList.remove("closed");
    tr.classList.remove("closed");
    userName.classList.remove("closed");
    rankImage.classList.remove("closed");
    stats.classList.remove("closed");
    nameRankTR.style.filter = "blur(0px)";

    let userRank = json.data.user.league.rank;
    // Set profile if ti exists, otherwise remove the deadspace
    if (!(json.data.user.avatar_revision == undefined)) {
      userProfile.setAttribute("src", "https://tetr.io/user-content/avatars/" + json.data.user._id + ".jpg?rv=" + json.data.user.avatar_revision )
    }
    else { userProfile.style.width = 0; }

    // Set divs content to API values
    main.style.background = rankColors[userRank]    ;
    rankImage.setAttribute("src", `https://tetr.io/res/league-ranks/` + userRank + `.png`);
    userName.innerHTML = json.data.user.username;
    userTR.innerHTML = (Math.round(json.data.user.league.rating * 10) ) / 10 + "<span id=subscript><sub>TR </sub></span>";
    globalRank.innerHTML = "#" + json.data.user.league.standing;
    apm.innerHTML = json.data.user.league.apm;
    pps.innerHTML = json.data.user.league.pps;
    vs.innerHTML = json.data.user.league.vs;
    let winLoss = Math.round(( json.data.user.league.gameswon / json.data.user.league.gamesplayed ) * 100 ) / 100
    wl.innerHTML = winLoss + "<span id=subscript><sub> (" + json.data.user.league.gameswon + "/" + json.data.user.league.gamesplayed + ")</sub></span>";
  }
  catch (error) {
    localStorage.removeItem("tetrioStatsUserData-" + user);
  }
}
