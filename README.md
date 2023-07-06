showRegisteredIP: "localhost:8080/ip/showregistered         It will registered ips"

    Method      GET
        get response
            on proceed          -> status(200)
            [
                "139.135.52.0",
                "139.135.52.22"
            ]

            on already exist    ->status(500)
                already exist

            on  fail            ->status(500)
                Invalid to saveIP



saveIP: "localhost:8080/ip/save                             It will save ips by taking ip,floor from body"

    Method      POST

    Input
    Take values from BODY
        {
            "ip":"139.135.52.12",
            "floor":"1st"
        }
    Output

    on save in databse get response ->status(200)

        Save your Ip: {
            _id: new ObjectId("1234"),
            ip: '139.135.52.12',
            floor: '1st',
            createdAt: 2023-07-06T11:56:38.736Z,
            updatedAt: 2023-07-06T11:56:38.736Z,
            __v: 0
        }

    on already exist get response ->status(500)
        already save in database    





save and mark Attandance Record from sessions of userlogins
    METHOD          GET
    "localhost:8080/attendance                  It will calculate attendace with time speration also"

    Input Requirement

        It will get data from body params
            params name 'dataApi'
            from dataset get data from 'data' variable
        Dummy data is in "https://champagne-bandicoot-hem.cyclic.app/api/data"
        data format type
        {
            "email":"abc@gmail.com",
            "check_in":"13:09:22",
            "check_out":"13:22:01",
            "total_time":"00:12",
            "ip_address":"123.123.123",
            "date":"2023-06-13"
        }
    Output

        get response
            when not save in database status(500)
                send("Data not saved in the database");

            on error    status(400)
                send({ Error: err });

            on save     status(200)
                "abc@gmail.com": {
                            "date": {
                                "2023-06-13": {
                                    "virtualTime": 0,
                                    "officeTime": 419,
                                    "attendance": "ABSENT",
                                    "ip": {
                                        "123.123.123": {
                                            "ip": "123.123.123",
                                            "total_time": 419
                                        }
                                    }
                                }
                            }
                        },
                
                Store data in database
                    {
                        "_id":{"$oid":"1234"},
                        "email":"abc@xyz.pqr",
                        "__v":{"$numberInt":"0"},
                                
                        "date":[
                            {
                                "_id":{"$oid":"12345"},
                                "date":2023-06-13T00:00:00.000+00:00
                                "virtualTime":1, || in minutes
                                "officeTime":1,  || in minutes
                                "attendance":"status", // status -> 'ABSENT'|| 'HALF DAY' || 'PRESENT'
                                    "ip":[
                                        {
                                        "ip":"123.123.123.123",
                                         "total_time":2151, || in minutes
                                          "_id":{"$oid":"12346"}
                                        },
                                        {
                                            "ip":"206.42.124.2",
                                            "total_time":{"$numberInt":"26"},
                                            "_id":{"$oid":"12347"}
                                        }
                                    ],
                                }
                            ]
                    }