var express = require('express');
var app = express();

app.post('/login', function (req, res) {
  res.json({ auth: true });
});

app.use("/", express.static(__dirname));

app.listen(3000);
