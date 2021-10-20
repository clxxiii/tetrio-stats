const rankImage = document.getElementById("rankImage");
const main = document.getElementById("main");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const userProfile = document.getElementById("userProfile");
const globalRank = document.getElementById("globalRank");
const nameRankTR = document.getElementById("nameRankTR");
const tr = document.getElementById("TR");

const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api?user=";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();

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
    userProfile.classList.remove("closed")
    tr.classList.remove("closed")
    userName.classList.remove("closed")
    rankImage.classList.remove("closed")
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
  }
  catch (error) {
    localStorage.removeItem("tetrioStatsUserData-" + user);
  }
}
