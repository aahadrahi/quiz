const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const { Pool } = require('pg');
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

const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Quiz',
  password: 'Aahad@123',
  port: 5432,
});


db.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log('Database connection successful:', result.rows[0].now)
  })
})

app.get("/", (req, res) => {
  if (req.session.username) {
    db.query(
      "SELECT * FROM users WHERE username = $1 AND email = $2 AND fathername = $3 ",
      [req.session.username,req.session.email,req.session.fathername],
      (err, result) => {
        if (err) {
          console.log('Error in first query:', err);
          return res.json({ valid: false });
        } else {
          console.log('Result of first query:', result);
          id=result.rows[0].id;
          db.query("SELECT * FROM user_score WHERE id = $1", [id], (err, result2) => {
            if (err) {
              console.log('Error in second query:', err);
              req.session.quiz = false;
            } else {
              console.log('Result of second query:', result2);

              if (result2.rowCount === 0) {
                req.session.quiz = false;
              } else {
                req.session.quiz = true;
              }
            }
            return res.json({
              valid: true,
              id: id,
              username: req.session.username,
              fathername: req.session.fathername,
              email: req.session.email,
              fullname: req.session.fullname,
              quiz: req.session.quiz
            });
          });
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
      let rows = data.rows;
      let tableHtml = "<table id='customers'><thead><tr><th>ID</th><th>Username</th><th>Full Name</th><th>Father Name</th><th>Class</th><th>Email</th></tr></thead><tbody>";
      rows.forEach((row) => {
        tableHtml += `<tr><td>${row.id}</td><td>${row.username}</td><td>${row.fullname}</td><td>${row.fathername}</td><td>${row.class}</td><td>${row.email}</td></tr>`;
      });
      tableHtml += "</tbody></table>";
      let html = `<!DOCTYPE html><html><head><title>Users</title><style>#customers {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      #customers td, #customers th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      
      #customers tr:nth-child(even){background-color: #f2f2f2;}
      
      #customers tr:hover {background-color: #ddd;}
      
      #customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04AA6D;
        color: white;
      }</style></head><body>${tableHtml}</body></html>`;
      res.send(html);
    }
  });
});

app.get("/score", (req, res) => {
  const sql = "SELECT * FROM user_score";
  db.query(sql, (err, data) => {
    if (err) {
      console.log(err)
      return res.json(err);
    } else {
      let rows = data.rows;
      let tableHtml = "<table id='customers'><thead><tr><th>ID</th><th>Score</th></tr></thead><tbody>";
      rows.forEach((row) => {
        tableHtml += `<tr><td>${row.id}</td><td>${row.score}</td></tr>`;
      });
      tableHtml += "</tbody></table>";
      let html = `<!DOCTYPE html><html><head><title>Users</title><style>#customers {
        font-family: Arial, Helvetica, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      
      #customers td, #customers th {
        border: 1px solid #ddd;
        padding: 8px;
      }
      
      #customers tr:nth-child(even){background-color: #f2f2f2;}
      
      #customers tr:hover {background-color: #ddd;}
      
      #customers th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: #04AA6D;
        color: white;
      }</style></head><body>${tableHtml}</body></html>`;
      res.send(html);
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
  const class_ = req.body.class;
  db.query(
    "INSERT INTO users (email, username, password , fathername,fullname,class) VALUES ($1, $2, $3, $4, $5, $6)",
    [email, username, password,fathername,fullname,class_name],
    (err , result) => {
      if (err) {
        console.log(err)
        return res.send({ message: err });
      } else {
        req.session.username = username;
        req.session.email = email;
        req.session.fathername = fathername;
        req.session.fullname = fullname;
        req.session.class = class_;
        return res.send(result);
      }
    }
  );
});


app.post("/score", (req, res) => {
  const id = req.body.id;
  const score = req.body.score;
  db.query(
    "INSERT INTO user_score (id, score) VALUES ($1, $2)",
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
    "SELECT * FROM users WHERE username = $1 AND password =  $2",
    [username, password],
    (err, result) => {
      if (err) {
        return res.send({ error: err });
      } else {
        if (result.rowCount > 0) {
          req.session.username = result.rows[0].username;
          req.session.email =  result.rows[0].email;
          req.session.fathername =  result.rows[0].fathername;
          req.session.id =  result.rows[0].id;
          req.session.fullname=result.rows[0].fullname;
          req.session.class=result.rows[0].class;
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


app.get("/json", (req, res) => {
  class_n =  `./class${req.session.class}.xlsx`;
  readXlsxFile(fs.createReadStream('./class.xlsx')).then((rows) => {
    const json = {
      title: 'Quiz Test',
      showProgressBar: 'bottom',
      showTimerPanel: 'top',
      maxTimeToFinishPage: 60,
      maxTimeToFinish: (rows.length -1) * 60,
      firstPageIsStarted: true,
      startSurveyText: 'Start Quiz',
      pages: [
        {
          elements: [
            {
              type: 'html',
              html: `You are about to start a quiz on WCEI. <br>You will have 15 seconds for every question and ${(rows.length -1) * 15} seconds to end the quiz.`
            }
          ]
        },
        ...rows.slice(1).map((row, i) => {
          const question = row[0];
          return {
            elements: [
              {
                type: 'radiogroup',
                name: `question${i + 1}`,
                title: question,
                choices: row.slice(1, -1),
                correctAnswer: row[row.length - 1],
                enableIf: 'empty'
              }
            ]
          };
        })
      ]
    };
    return res.json(json);;
  });
});










app.listen(8081, () => {
  console.log("listening");
});






