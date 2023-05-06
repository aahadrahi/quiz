const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 },
  })
);

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quiz",
});

app.get("/", (req, res) => {
  if (req.session.username) {
    db.query(
      "SELECT * FROM users WHERE username = ? AND email = ? AND fathername = ? ",
      [req.session.username,req.session.email,req.session.fathername],
      (err, result) => {
        if (err) {
          return res.json({ valid: false });
        } else {
          id=result[0].id
          return res.json({ valid: true,id:id, username: req.session.username,fathername:req.session.fathername,email:req.session.email,fullname:req.session.fullname});
        }
      }
    );
  } else {
    return res.json({ valid: false });
  }
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

app.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const fathername = req.body.fathername;
  const class_name = req.body.class;
  const fullname = req.body.fullname;
  db.query(
    "INSERT INTO users (email, username, password , fathername,fullname,class) VALUES (?, ?, ?, ?,?,?)",
    [email, username, password,fathername,fullname,class_name],
    (err, result) => {
      if (err) {
        return res.send({ message: err });
      } else {
        req.session.username = username;
        req.session.email = email;
        req.session.fathername = fathername;
        req.session.fullname = fullname;
        return res.send(result);
      }
    }
  );
});


app.post("/score", (req, res) => {
  const id = req.body.id;
  const score = req.body.score;
  db.query(
    "INSERT INTO user_score (id, score) VALUES (?, ?)",
    [id, score],
    (err, result) => {
      if (err) {
        return res.send({ message: err});
      } else {
      
        return res.send(result);
      }
    }
  );
});

app.post("/sign-in", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, result) => {
      if (err) {
        return res.send({ error: err });
      } else {
        if (result.length > 0) {
          req.session.username = result[0].username;
          req.session.email =  result[0].email;
          req.session.fathername =  result[0].fathername;
          req.session.id =  result[0].id;
          req.session.fullname=result[0].fullname
          return res.send(result);
        } else {
          return res.send({ message: "WRONG USERNAME OR PASSWORD" });
        }
      }
    }
  );
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Server error");
    } else {
      return res.send({ message: "Logout successful" });
    }
  });
});

app.listen(8081, () => {
  console.log("listening");
});
