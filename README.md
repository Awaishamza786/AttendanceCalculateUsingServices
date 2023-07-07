
## Description

This project provides an API for managing IP addresses and attendance records. It allows users to register and retrieve IP addresses, save IP addresses with corresponding floor information, and calculate attendance records based on user logins.

## Endpoints

### Show Registered IP

- URL: `localhost:8080/ip/showregistered`
- Method: GET
- Description: Retrieves a list of registered IP addresses.
- Response:

    - On Success (200):
        ```
        [
            "139.135.52.0",
            "139.135.52.22"
        ]
        ```

    - If IP addresses already exist (500):
        ```
        already exist
        ```

    - On Failure (500):
        ```
        Invalid to saveIP
        ```

### Save IP

- URL: `localhost:8080/ip/save`
- Method: POST
- Description: Saves an IP address along with its corresponding floor information.
- Request Body:

    ```
    {
        "ip": "139.135.52.12",
        "floor": "1st"
    }
    ```

- Response:

    - On successful save in the database (200):
        ```
        Save your IP: {
            _id: new ObjectId("1234"),
            ip: '139.135.52.12',
            floor: '1st',
            createdAt: 2023-07-06T11:56:38.736Z,
            updatedAt: 2023-07-06T11:56:38.736Z,
            __v: 0
        }
        ```

    - If the IP address is already saved in the database (500):
        ```
        already save in database
        ```

### Save and Mark Attendance Record

- URL: `localhost:8080/attendance`
- Method: GET
- Description: Calculates attendance records based on user login sessions.
- Request Requirement:

    - It expects data in the body parameter named `dataApi`.
    - The dataset should contain the following data format:
    
        ```
        {
            "email": "abc@gmail.com",
            "check_in": "13:09:22",
            "check_out": "13:22:01",
            "total_time": "00:12",
            "ip_address": "123.123.123",
            "date": "2023-06-13"
        }
        ```

- Response:

    - If data is not saved in the database (500):
        ```
        Data not saved in the database
        ```

    - On error (400):
        ```
        { Error: err }
        ```

    - On successful save (200):
        ```
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
        }
        ```

        - Store data in the database:
        ```
        {
            "_id": { "$oid": "1234" },
            "email": "abc@xyz.pqr",
            "__v": { "$numberInt": "0" },
                                
            "date": [
                {
                    "_id": { "$oid": "12345" },
                    "date": "2023-06-13T00:00:00.000+00:00",
                    "virtualTime": 1,  // in minutes
                    "officeTime": 1,   // in minutes
                    "attendance": "status", // 'ABSENT', 'HALF DAY', or 'PRESENT'
                    "ip": [
                        {
                            "ip": "123.123.123.123",
                            "total_time": 2151, // in minutes
                            "_id": { "$oid": "12346" }
                        },
                        {
                            "ip": "206.42.124.2",
                            "total_time": { "$numberInt": "26" },
                            "_id": { "$oid": "12347" }
                        }
                    ]
                }
            ]
        }
        ```
        

