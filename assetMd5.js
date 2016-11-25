/**
 * @assetMd5
 * @author  stylehuan
 * @create  2016-07-07 15:45
 */
var fs = require("fs");
var path = require("path");
var crypto = require('crypto');
var arguments = process.argv.splice(2);
var mapUri = __dirname + "/resource/resource.json";
var exists = function (path) {
    return fs.existsSync(path);
};
var isApp = arguments.length;

function createMd5(str, slice) {
    slice = slice || 10;
    var md5 = crypto.createHash('md5');
    md5.update(str, 'utf8');

    return slice > 0 ? md5.digest('hex').slice(0, slice) : md5.digest('hex');
}

var entry = function () {
    var _uri = path.normalize(mapUri);
    var isExists = exists(_uri);
    if (!isExists) {
        console.log("静态map文件不存在");
        return;
    }
    var resource = fs.readFileSync(mapUri);
    var _map = null;

    if (resource) {
        _map = JSON.parse(resource);

        if (_map.resources && _map.resources.length) {
            for (var i = 0; i < _map.resources.length; i++) {
                var _tempUri;
                var _assetItem = _tempUri = _map.resources[i]["url"].replace(/\?t=.+/g, "");

                console.log(_assetItem);
                if (_assetItem) {
                    _assetItem = path.normalize(__dirname + "/resource/" + _assetItem);

                    if (!exists(_assetItem))  continue;
                    //var md5sum = crypto.createHash('md5');
                    //var stream = fs.createReadStream(_assetItem);
                    //stream.on('data', function(chunk) {
                    //    md5sum.update(chunk);
                    //});
                    //stream.on('end', function() {
                    //    str = md5sum.digest('hex').toUpperCase();
                    //    console.log('�ļ�:'+path+',MD5ǩ��Ϊ:'+str);
                    //});
                    console.log(_tempUri);
                    if (!isApp) {
                        var data = fs.readFileSync(_assetItem, {encoding: "binary"});
                        var md5 = createMd5(data);
                        var t = +new Date();
                        _map.resources[i]["url"] = _tempUri + "?t=" + md5 + t;
                    } else {
                        _map.resources[i]["url"] = _tempUri;
                    }

                    console.log(_map.resources[i]["url"]);
                }
            }

            var strMap = JSON.stringify(_map);
            fs.writeFileSync(mapUri, strMap);
        }

        //for (var k in entryJson) {
        //    entryList[k] = path.join(__dirname, "./src", entryJson[k]);
        //}
    }

};
entry();

