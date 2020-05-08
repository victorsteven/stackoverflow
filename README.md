
[![Build Status](https://travis-ci.org/victorsteven/stackoverflow.svg?branch=master)](https://travis-ci.org/victorsteven/stackoverflow)  [![Coverage Status](https://coveralls.io/repos/github/victorsteven/stackoverflow/badge.svg?branch=master)](https://coveralls.io/github/victorsteven/stackoverflow?branch=master)

Heroku API: https://stackoverflow-work.herokuapp.com

### Clone the application 

Using SSH:
```
git clone https://github.com/victorsteven/stackoverflow.git
```

#### Change to the application directory:
```
cd stackoverflow
```

### Install Dependencies
```
npm install
```

#### API Documentation:
```
cd stackoverflow/api/docs
```

### Add JWT Secret
Create a **.env** from the root directory
```
touch .env
```
Simply copy the content of **.env.example** file, you can change the value of the **JWT_SECRET**

### Run the Application

```
npm run dev
```

### Run Tests Suite

```
npm test
```
