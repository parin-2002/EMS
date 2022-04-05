
# EMS (Employee Management System)

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/parin-2002/EMS/main/documentation/homepage1.PNG)


## Tech Stack

**Client:** React, Redux, bootstrap 5, material ui, full calendar

**Server:** Node, Express, MongoDB


## Demo

[Live Website](https://app-ems-system.herokuapp.com/)


## Documentation

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
