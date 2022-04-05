
# EMS (Employee Management System)

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/parin-2002/EMS/main/documentation/homepage1.PNG)


## Tech Stack

**Client:** React, Redux, bootstrap 5, material ui, full calendar

**Server:** Node, Express, MongoDB


## Demo

[Live Website](https://app-ems-system.herokuapp.com/)


## Documentation

[presentation](https://docs.google.com/presentation/d/1ePOyiQO1FYowh16nG_9twuLAdCEg0SfFq8tbpUCUXQA/edit?usp=sharing_eil_se_dm&ts=6243078e)
[Documentation](https://github.com/parin-2002/EMS/blob/main/documentation/sem-6-project-docs.pdf)


## Run Locally

Clone the project

```bash
  git clone https://github.com/parin-2002/EMS.git
```

Go to the project directory (Backend Setup)

```bash
  cd EMS_Backend_API
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

Go to the project directory (Fronted Setup)

```bash
  cd EMS_Frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file.
You will find REFRESH_TOKEN, CLIENT_SECRET, CLIENT_ID on google console when you create API key for sending Mail.

`PORT`

`DATABASE_URL`

`COMPANYKEY`

`EMPKEY`

`EMAIL`

`OTPTIME`

`REFRESH_TOKEN`

`CLIENT_SECRET`

`CLIENT_ID`

`OTPTIME`

I have already given one env file with minimal information in the Project folder.



## API Reference


####  Company Methods

```
  POST /api/company/register
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required** |
| `email` | `string` | **Required** |
| `mobileno` | `string` | **Required** |
| `address` | `string` | **Required** |
| `password` | `string` | **Required** |
| `aboutcompany` | `string` | **Required** |
| `links` | `Array Object` | **Not Required** |
| `numberOfemployees` | `Number` | **Required** |

```
  POST /api/company/verifyRegistation
```

```
  POST /api/company/resendotp
```

```
  POST /api/company/login
```

```
  GET /api/company/selectcompanydetail
```

```
  PUT /api/company/editaccount
```

```
  PUT /api/company/updatepassword
```

```
  PUT /api/company/updateicon
```





