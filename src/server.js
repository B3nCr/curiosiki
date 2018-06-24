var path = require('path'),
    formBody = require("body/form"),
    wtf = require('wtf_wikipedia'),
    _ = require("lodash"),
    express = require('express'),
    mustacheExpress = require('mustache-express');

var app = express()

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.get('/', function (req, res) {
    res.render('index', {
        content: null,
        searchterm: 'Curiousiki',
        digValue: null
    });
});

app.post("/", function (req, res) {

    formBody(req, {}, function (err, body) {
        
        console.log("Form Body: " + JSON.stringify(body));

        var query = body.frmSearch;

        if (body.frmSearch == null || body.frmSearch === "" || body.frmSearch.toUpperCase() === "CURIOUSIKI") {
            res.redirect('/about');
            return;
        }

        var wikipedia = require('./wikipedia');

        console.log("searching...");
        wikipedia.search(query).then(function (pageData) {

            console.log("Dug Term: " + pageData.selectedLink);

            res.render("index", _.assignIn(pageData, {
                searchterm: query,
                dugterm: pageData.selectedLink
            }));
        });
    });
});

app.get('/about', function (req, res) {
    res.render('about', {
        content: null,
        searchterm: 'Curiousiki',
        digValue: null
    });
});


app.get('/blank', function (req, res) {
    res.render('index', {
        content: null,
        searchterm: 'Curiousiki',
        digValue: null
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))
