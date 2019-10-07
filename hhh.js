CloudDBZone.prototype.executeUpsert = function (objectTypeName, objects, callback) {
    for (var i = 0; i < objects.length; i++) {
        var keys = Object.keys(objects[i]);
        for (var j = 0; j < keys.length; j++) {
            if (typeof (objects[i][keys[j]]) == 'string' || objects[i][keys[j]] instanceof Array) {
                continue;
            } else if (!isFinite(objects[i][keys[j]])) {
                console.log("{\"info\":\"" + "object " + i + ":" + keys[j] + " is not Finite\"}");
                callback(false, (keys[j] + " is not Finite"));
                return;
            }
        }
    }
    var path = "/clouddbservice/v1/objects";
    var method = "POST";
    var param = {
        cloudDBZoneName: this.cloudDBZoneName,
        objectTypeName: objectTypeName,
        objects: objects
    };
    sendRequest(path, method, param, callback);
}

CloudDBZone.prototype.executeDelete = function (objectTypeName, objects, callback) {
    var path = "/clouddbservice/v1/objects";
    var method = "DELETE";
    var param = {
        cloudDBZoneName: this.cloudDBZoneName,
        objectTypeName: objectTypeName,
        objects: objects
    };
    sendRequest(path, method, param, callback);
}

CloudDBZone.prototype.executeDeleteAll = function (objectTypeName, callback) {
    var path = "/clouddbservice/v1/allObjects";
    var method = "DELETE";
    var param = {
        cloudDBZoneName: this.cloudDBZoneName,
        objectTypeName: objectTypeName
    };
    sendRequest(path, method, param, callback);
}

function sendRequest(path, method, param, callback) {
    var path = path;
    var method = method;
    var param = param;
    var promise = new Promise(function (resolve, reject) {
        mHttpsClient.send(path, method, param, function (flag, result) {
            if (flag) {
                resolve(result);
            } else {
                reject(result);
            }
        });
    });
    promise.then(function (data) {
        var path = "/clouddbservice/v1/processPercentage";
        var method = "POST";
        var param = {
            'processId': data.processId
        };
        var timer = setInterval(function () {
            mHttpsClient.send(path, method, param, function (flag, result) {
                if (flag) {
                    if (result.finished) {
                        if (result.handleDataProcess < 100) {
                            reject(result);
                        } else {
                            callback(true, result);
                        }
                        clearTimeout(timer);
                    }
                } else {
                    reject(result);
                }
            });
        }, 1000);
    }).catch(function (data) {
        callback(false, data);
        clearTimeout(timer);
    });
}
