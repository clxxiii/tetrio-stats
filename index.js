const rankImage = document.getElementById("rankImage");
const userName = document.getElementById("userName");
const userTR = document.getElementById("userTR");
const API_URL = "https://7yortti0f2.execute-api.us-east-2.amazonaws.com/api";
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const callTime = new Date().getTime();
const testJson = {
   "success":true,
   "data":{
      "user":{
         "_id":"5e7a392fe55cb634a81b6127",
         "username":"clxxiii",
         "role":"user",
         "ts":"2020-03-24T16:45:35.429Z",
         "badges":[
            {
               "id":"secretgrade",
               "label":"Achieved the full Secret Grade",
               "ts":"2020-05-12T18:33:53.123Z"
            }
         ],
         "xp":2093104,
         "gamesplayed":1865,
         "gameswon":537,
         "gametime":644170.140795555,
         "country":"US",
         "supporter":true,
         "supporter_tier":1,
         "verified":false,
         "league":{
            "gamesplayed":504,
            "gameswon":257,
            "rating":20296.512490516423,
            "glicko":1883.4759423564303,
            "rd":67.18081458528094,
            "rank":"s+",
            "apm":33.15,
            "pps":1.43,
            "vs":76.31,
            "decaying":false,
            "standing":4638,
            "percentile":0.15050308341447582,
            "standing_local":1012,
            "prev_rank":"s",
            "prev_at":5237,
            "next_rank":"ss",
            "next_at":3390,
            "percentile_rank":"s+"
         },
         "avatar_revision":1618002894086,
         "banner_revision":1618610003550,
         "bio":"**Hi I play osu**",
         "friend_count":46
      }
   },
   "cache":{
      "status":"miss",
      "cached_at":1633410893457,
      "cached_until":1633411193457
   }
}


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
  if (testJson.cache.cached_until > callTime) { console.log("using cached data"); return currentJson  } // Only make a call if the current data is outdated
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
    localStorage.setItem("tetrioStatsUserData", JSON.stringify(response))

    return response
  }


}
async function updateData() {
  let json = getUserData();

  let userRank = json.data.user.league.rank;
  rankImage.setAttribute("src", `src/ranks/` + userRank + `.png`);
  userName.innerHTML = json.data.user.username;
  userTR.innerHTML = (Math.round(json.data.user.league.rating * 10) ) / 10

  console.log(new Date().getTime())
}

function logData() {
  console.log(localStorage.getItem("tetrioStatsUserData"))
}
