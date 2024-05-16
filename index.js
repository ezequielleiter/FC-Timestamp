var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

app.use(express.static('public'));

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/:date_string?', function(req, res) {
  let date_string = req.params.date_string;

  let now = new Date();

  if (!date_string) {
    return res.json({
      unix: now.getTime(),
      utc: now.toUTCString(),
    })
  }

  // Regex
  let pattern1 = /^\d{4}-\d{2}-\d{2}$/; // 2015-12-25
  let pattern2 = /^\d+$/; // 1451001600000
  let pattern3 = /^\d{2}\s(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}?/; // 05 October 2015

  let unix;
  let utc;

  if (date_string.match(pattern1) || date_string.match(pattern3)) {
    let date = new Date(date_string);

    unix = date.getTime();
    utc = date.toUTCString();
    return res.json({
      unix: Number(unix),
      utc: utc,
    })
  }

  if (date_string.match(pattern2)) {
    let dateObj = new Date(Number(date_string));
    unix = Number(date_string);
    let utc = dateObj.toUTCString();
    return res.json({
      unix: unix,
      utc: utc,
    })
  }

  return res.json({
    'error': 'Invalid Date',
  })

})


var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});