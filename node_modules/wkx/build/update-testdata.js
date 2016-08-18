var fs = require('fs');
var pg = require('pg');
var async = require('async');
var stringify = require('json-stringify-pretty-compact');

updateTestData('./test/testdata.json');
updateTestData('./test/testdataZ.json');
updateTestData('./test/testdataM.json');
updateTestData('./test/testdataZM.json');

function updateTestData(file) {
    var testdata = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));

    var connectionString = 'postgres://postgres:postgres@localhost/postgres';

    var client = new pg.Client(connectionString);
    client.connect(function(err) {
        async.forEachOf(testdata, function (value, key, callback) {
            client.query('SELECT encode(ST_AsBinary(ST_GeomFromText($1)), \'hex\') wkb, ' +
                         'encode(ST_AsEWKB(ST_GeomFromText($1, 4326)), \'hex\') ewkb, ' +
                         'encode(ST_AsBinary(ST_GeomFromText($1), \'xdr\'), \'hex\') wkbxdr, ' +
                         'encode(ST_AsEWKB(ST_GeomFromText($1, 4326), \'xdr\'), \'hex\') ewkbxdr, ' +
                         'encode(ST_AsTWKB(ST_GeomFromText($1, 4326)), \'hex\') twkb, ' +
                         'ST_AsGeoJSON(ST_GeomFromText($1, 4326)) geojson', [value.wkt], function (err, result) {

                value.wkb = result.rows[0].wkb;
                value.ewkb = result.rows[0].ewkb;
                value.wkbXdr = result.rows[0].wkbxdr;
                value.ewkbXdr = result.rows[0].ewkbxdr;
                value.twkb = result.rows[0].twkb;
                value.geoJSON = JSON.parse(result.rows[0].geojson);

                callback();
            });
        }, function () {
            client.end();
            fs.writeFileSync(file, stringify(testdata));
        });
    });
}
