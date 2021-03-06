function heartbeat() {

    var http = new XMLHttpRequest()
    var url = "https://openseed.vagueentertainment.com:8675/corescripts/heartbeat.php"

    http.onreadystatechange = function () {

        if (http.status === 200) {
            if (http.readyState === 4) {

                if (http.responseText === "100") {
                    console.log("Incorrect DevID")
                } else if (http.responseText === "101") {
                    console.log("Incorrect AppID")
                } else {

                    heart = http.responseText
                    beat.interval = 20000
                }
            }
        } else {
            heart = "Offline"
        }
    }
    http.open('POST', url.trim(), true)

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("devid=" + devId + "&appid=" + appId + "&userid=" + userID)
}

function checkOpenSeed(userid, code, editdate, type) {

    /* Checks for the existance of the data type */
    var http = new XMLHttpRequest()
    var url = "https://openseed.vagueentertainment.com:8675/devs/Vag-01001011/vagEdu-053018/scripts/check.php"

    http.onreadystatechange = function () {

        if (http.status === 200) {
            if (http.readyState === 4) {

                if (http.responseText == "100") {
                    console.log("Incorrect DevID")
                } else if (http.responseText == "101") {
                    console.log("Incorrect AppID")
                } else {

                    if (parseInt(http.responseText.trim()) === 0) {
                        console.log("Sending " + type + " to Openseed: " + editdate)
                        sendToOpenSeed(userid, code, type)
                    } else if (type === "Educator"
                               && schoolSetup.state == "Active") {
                        console.log("Moving to Retrieve")
                        retrieveFromOpenSeed(userid, code, type)
                    }
                }
            }
        }
    }
    http.open('POST', url.trim(), true)

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("devid=" + devId + "&appid=" + appId + "&userid=" + userid
              + "&code=" + code + "&editdate=" + editdate + "&type=" + type)
}

function sendToOpenSeed(userid, code, type) {

    /* Sends data to Server */
    var http = new XMLHttpRequest()
    var url = "https://openseed.vagueentertainment.com:8675/devs/Vag-01001011/vagEdu-053018/scripts/update.php"
    var pull = ""

    db.readTransaction(function (tx) {

        switch (type) {
        case "School":
            pull = tx.executeSql(
                        "SELECT * FROM Schools WHERE id='" + userid + "'")
            break
        case "Educator":
            pull = tx.executeSql(
                        "SELECT * FROM Users WHERE id='" + userid + "'")
            break
        case "Courses":
            pull = tx.executeSql(
                        "SELECT * FROM Courses WHERE id='" + userid + "' AND creationdate=" + code)
            break
        case "Units":
            pull = tx.executeSql(
                        "SELECT * FROM Units WHERE id='" + userid + "' AND creationdate=" + code)
            break
        case "Lessons":
            pull = tx.executeSql(
                        "SELECT * FROM Lessons WHERE id='" + userid + "' AND creationdate=" + code)
            break
        case "Students":
            pull = tx.executeSql(
                        "SELECT * FROM Students WHERE id='" + userid + "' AND code=" + code)
            break
        case "Schedule":
            pull = tx.executeSql(
                        "SELECT * FROM Schedule WHERE id='" + userid + "' AND creationdate=" + code)
            break
        }
        console.log(pull.rows.length)
        if (pull.rows.length === 1) {

            console.log("Sending " + type)

            http.onreadystatechange = function () {

                if (http.status == 200) {
                    if (http.readyState == 4) {
                        if (http.responseText == "100") {
                            console.log("Incorrect DevID")
                        } else if (http.responseText == "101") {
                            console.log("Incorrect AppID")
                        } else {

                            /* leaving this here for debugging purposes */
                            // console.log(http.responseText)
                        }
                    }
                }
            }
            http.open('POST', url.trim(), true)

            http.setRequestHeader("Content-type",
                                  "application/x-www-form-urlencoded")

            switch (type) {
            case "School":
                http.send("devid=" + devId + "&appid=" + appId
                          + "&userid=" + userid + "&name=" + pull.rows.item(
                              0).name + "&email=" + pull.rows.item(0).email
                          + "&phone=" + pull.rows.item(0).phone + "&country="
                          + pull.rows.item(0).country + "&state=" + pull.rows.item(
                              0).state + "&about=" + pull.rows.item(0).about
                          + "&code=" + pull.rows.item(0).code + "&editdate="
                          + pull.rows.item(0).editdate + "&type=" + type)
                break
            case "Educator":
                http.send("devid=" + devId + "&appid=" + appId
                          + "&userid=" + userid + "&firstname=" + pull.rows.item(
                              0).firstname + "&lastname=" + pull.rows.item(0).lastname
                          + "&email=" + pull.rows.item(0).email + "&phone="
                          + pull.rows.item(0).phone + "&country=" + pull.rows.item(
                              0).country + "&state=" + pull.rows.item(0).state
                          + "&about=" + pull.rows.item(0).about + "&code="
                          + pull.rows.item(0).code + "&editdate=" + pull.rows.item(
                              0).editdate + "&type=" + type)
                break
            case "Courses":
                http.send("devid=" + devId + "&appid=" + appId
                          + "&userid=" + userid + "&name=" + pull.rows.item(
                              0).name + "&subject=" + pull.rows.item(0).subject
                          + "&about=" + pull.rows.item(0).about + "&code="
                          + pull.rows.item(0).creationdate + "&language=" + pull.rows.item(
                              0).language + "&schoolCode=" + schoolCode + "&educatorCode="
                          + userCode + "&editdate=" + pull.rows.item(0).editdate + "&type=" + type)
                break
            case "Units":
                http.send("devid=" + devId + "&appid=" + appId
                          + "&userid=" + userid + "&name=" + pull.rows.item(
                              0).name + "&about=" + pull.rows.item(0).about
                          + "&objective=" + pull.rows.item(0).objective + "&code="
                          + pull.rows.item(0).creationdate + "&course=" + pull.rows.item(
                              0).coursenumber + "&schoolCode=" + schoolCode + "&educatorCode="
                          + userCode + "&editdate=" + pull.rows.item(0).editdate + "&type=" + type)
                break
            case "Students":
                http.send("devid=" + devId + "&appid=" + appId
                          + "&userid=" + userid + "&firstname=" + pull.rows.item(
                              0).firstname + "&lastname=" + pull.rows.item(0).lastname
                          + "&age=" + pull.rows.item(0).age + "&bday="
                          + pull.rows.item(0).bday + "&email=" + pull.rows.item(
                              0).email + "&phone=" + pull.rows.item(0).phone
                          + "&about=" + pull.rows.item(0).about + "&code="
                          + pull.rows.item(0).code + "&schoolCode=" + schoolCode
                          + "&editdate=" + pull.rows.item(0).editdate + "&type=" + type)
                break
            case "Schedule":
                http.send("devid=" + devId + "&appid=" + appId
                          + "&userid=" + userid + "&month=" + pull.rows.item(
                              0).month + "&day=" + pull.rows.item(0).day
                          + "&code=" + pull.rows.item(
                              0).creationdate + "&schoolCode="
                          + schoolCode + "&educatorCode=" + userCode + "&editdate="
                          + pull.rows.item(0).editdate + "&type=" + type)
                break
            case "Lessons":
                http.send("devid=" + devId + "&appid=" + appId + "&userid=" + userid + "&course=" + pull.rows.item(
                              0).coursenumber + "&unit=" + pull.rows.item(0).unitnumber + "&name=" + pull.rows.item(0).name + "&lessonNum=" + pull.rows.item(0).lessonNum + "&duration=" + pull.rows.item(0).duration + "&about=" + pull.rows.item(0).about + "&objective=" + pull.rows.item(0).objective + "&supplies=" + pull.rows.item(0).supplies + "&resources=" + pull.rows.item(
                              0).resources + "&guidingQuestions=" + pull.rows.item(0).guidingQuestions + "&lessonSequence=" + pull.rows.item(0).lessonSequence + "&studentProduct=" + pull.rows.item(0).studentProduct + "&reviewQuestions=" + pull.rows.item(0).reviewQuestions + "&code=" + pull.rows.item(0).creationdate + "&schoolCode=" + schoolCode + "&educatorCode=" + userCode + "&editdate=" + pull.rows.item(0).editdate + "&type=" + type)
                break
            }
        }
    })
}

function retrieveFromOpenSeed(id, code, type) {

    /* retrieves data to Server */
    var http = new XMLHttpRequest()
    var url = "https://openseed.vagueentertainment.com:8675/devs/Vag-01001011/vagEdu-053018/scripts/retrieve.php"
    var pull = ""
    http.onreadystatechange = function () {

        if (http.status === 200) {
            if (http.readyState === 4) {

                if (http.responseText == "100") {
                    console.log("Incorrect DevID")
                } else if (http.responseText == "101") {
                    console.log("Incorrect AppID")
                } else {

                    if (http.responseText.length > 3) {

                        var info = http.responseText.split(";&;")

                        console.log(info)

                        db.transaction(function (tx) {

                            switch (type) {
                            case "School":
                                pull = tx.executeSql(
                                            "SELECT * FROM Schools WHERE code='" + id + "'")
                                break
                            case "Students":
                                pull = tx.executeSql(
                                            "SELECT * FROM Students WHERE code='" + id + "'")
                                break
                            case "Educator":
                                pull = tx.executeSql(
                                            "SELECT * FROM Users WHERE id='" + id + "'")
                                break
                            default:
                                pull = tx.executeSql(
                                            "SELECT * FROM " + type
                                            + " WHERE creationdate='" + id + "'")
                                break
                            }

                            if (pull.rows.length === 0) {

                                switch (type) {
                                case "School":
                                    schoolName = info[1]
                                    tx.executeSql(
                                                "INSERT INTO Schools VALUES (?,?,?,?,?,?,?,?,?,?)",
                                                [userID, 1, info[1], info[2], info[3], info[4], info[5], info[6], info[0], info[7]])
                                    break
                                case "Educator":
                                    userName = info[2] + " " + info[3]
                                    tx.executeSql(
                                                "INSERT INTO Users VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                                                [userID, 1, info[2], info[3], info[4], info[5], info[6], info[7], info[8], info[0], info[9]])

                                    if (schoolSetup.state == "Active") {
                                        isEducator.checked = 1
                                        view.currentIndex = 1
                                    }
                                    break
                                case "Courses":
                                    tx.executeSql(
                                                "INSERT INTO Courses VALUES(?,?,?,?,?,?,?)",
                                                [userID, info[1], info[3], info[4], info[2], info[0], info[7]])
                                    break
                                case "Units":
                                    tx.executeSql(
                                                "INSERT INTO Units VALUES(?,?,?,?,?,?,?)",
                                                [userID, info[4], info[1], info[2], info[3], info[0], info[7]])
                                    break
                                case "Students":
                                    tx.executeSql(
                                                "INSERT INTO Students VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
                                                [userID, info[2], info[3], info[4], info[6], info[5], info[9], info[8], info[7], "", info[0], info[10]])
                                    break
                                case "Schedule":
                                    tx.executeSql(
                                                "INSERT INTO Schedule VALUES(?,?,?,?,?,?,?)",
                                                [userID, info[1], info[2], info[3], info[4], info[0], info[5]])
                                    break
                                case "Lessons":

                                    tx.executeSql(
                                                "INSERT INTO Lessons VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                                [userID, info[15], info[17], info[4], info[5], info[1], info[6], info[7], info[2], info[3], info[9], info[8], info[10], info[11], info[12], info[13], info[0], info[16]])
                                    break
                                }
                            }
                        })
                    }
                }
            }
        }
    }
    http.open('POST', url.trim(), true)

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("devid=" + devId + "&appid=" + appId + "&userid=" + userID
              + "&code=" + id + "&type=" + type)
}

function sync(type, code) {


    /* Syncronizes data with the server */
    var http = new XMLHttpRequest()
    var url = "https://openseed.vagueentertainment.com:8675/devs/Vag-01001011/vagEdu-053018/scripts/sync.php"

    http.onreadystatechange = function () {

        if (http.status === 200) {
            if (http.readyState === 4) {
                if (http.responseText == "100") {
                    console.log("Incorrect DevID")
                } else if (http.responseText == "101") {
                    console.log("Incorrect AppID")
                } else {
                    var pull = ""
                    var num = 0

                    db.readTransaction(function (tx) {

                        var ids = http.responseText.split("\n")
                        if (ids[0] !== "0") {
                            while (ids.length > num) {
                                if (type === "Students") {
                                    pull = tx.executeSql(
                                                "SELECT * FROM " + type
                                                + " WHERE code=" + ids[num] + "")
                                } else {
                                    pull = tx.executeSql(
                                                "SELECT * FROM " + type
                                                + " WHERE creationdate=" + ids[num] + "")
                                }
                                if (pull.rows.length === 0) {
                                    console.log("Grabbing " + type + " from Server " + ids[num])
                                    retrieveFromOpenSeed(ids[num], code, type)
                                }

                                num = num + 1
                            }
                        } else {
                            console.log("Checking for local data")
                            var sendnum = 0
                            pull = tx.executeSql(
                                        "SELECT * FROM " + type + " WHERE 1")
                            console.log("We have " + pull.rows.length + " " + type + " locally")

                            while (pull.rows.length > sendnum) {

                                if (type === "Students") {
                                    sendToOpenSeed(userID, pull.rows.item(
                                                       sendnum).code, type)
                                } else {
                                    sendToOpenSeed(userID, pull.rows.item(
                                                       sendnum).creationdate,
                                                   type)
                                }

                                sendnum = sendnum + 1
                            }
                        }
                    })
                }
            }
        }
    }
    http.open('POST', url.trim(), true)

    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    http.send("devid=" + devId + "&appid=" + appId + "&userid=" + userID
              + "&code=" + code + "&type=" + type)
}
