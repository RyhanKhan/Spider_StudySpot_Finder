import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";

let today = new Date();
let time = today.getHours();
let day = today.getDay();

console.log(time);
console.log(day);

const app = express();
const port = 3000;

const apiKey = "483c71b423974c76c9f100effebe196c";
let latitude;
let longitude;
let Name;
let status;
let occupants = "0";
let comments = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.post("/", (req, res) => {
  const buildingName = req.body.buildingName;
  console.log(buildingName);
  switch (buildingName) {
    case "Orion":
      Name = "Orion Room";
      latitude = 10.75967;
      longitude = 78.812092;

      if (day === 0 || day === 6) {
        status = "Closed";
      } else if (time >= 8 && time <= 17) {
        status = "Open";
      } else {
        status = "Closed";
      }
      if (status === "Open") {
        if ((time >= 8 && time <= 12) || (time >= 14 && time <= 17)) {
          occupants = "50-70 people per room";
        }
      }
      break;
    case "LHC":
      Name = "LHC Room";
      latitude: 10.759749;
      longitude: 78.811025;

      if (day === 0 || day === 6) {
        status = "Closed";
      } else if (time >= 8 && time <= 17) {
        status = "Open";
      } else {
        status = "Closed";
      }
      if (status === "Open") {
        occupants = "40-50 people per room";
      }
      break;
    case "Library (NIT Trichy)":
      Name = "Library (NITT) Room";
      latitude: 10.757272;
      longitude: 78.818149;

      if (day === 0) {
        if (time >= 9 && time <= 13) {
          status = "Open";
        }
      } else if (time >= 9 && time <= 20) {
        status = "Open";
      } else {
        status = "Closed";
      }
      if (status === "Open") {
        occupants = "15-20 people per room";
      }
      break;
    case "Library (NIT Srinagar)":
      Name = "Library (NITS) Room";
      latitude: 34.123895;
      longitude: 74.839366;

      if (day === 0) {
        if (time >= 9 && time <= 13) {
          status = "Open";
        }
      } else if (time >= 9 && time <= 20) {
        status = "Open";
      } else {
        status = "Closed";
      }
      if (status === "Open") {
        occupants = "15-20 people per room";
      }
      break;

    case "Octagon":
      Name = "Octagon Room";
      latitude: 10.760555;
      longitude: 78.814655;
      status = "Open";
      if (time >= 10 && time <= 23) {
        occupants = "50-60 people per room";
      } else occupants = "10-20 people per room";
      break;

    default:
      break;
  }

  res.redirect("/weather");
});

app.get("/weather", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );
    const result = response.data;
    console.log(result.main.temp);
    console.log(result.main.humidity);

    res.render("status.ejs", {
      temperature: result.main.temp,
      humidity: result.main.humidity,
      ourName: Name,
      ourStatus: status,
      ourOccupants: occupants,
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
  }
});

app.get("/comment", (req, res) => {
  res.render("comment.ejs");
});

app.post("/comment", (req, res) => {
  const ourData = {
    ourUserName: req.body.userName,
    ourUserBuilding: req.body.userBuilding,
    ourUserComment: req.body.userComment,
  };
  console.log(ourData);
  comments.push(ourData);
  res.redirect("/messages");
});
app.get("/messages", (req, res) => {
  res.render("messages", {
    ourComments: comments,
  });
});

app.listen(port, () => {
  console.log("Server started on port ", port);
});
