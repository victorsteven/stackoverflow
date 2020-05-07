Heroku API: https://premier-league-fx.herokuapp.com

### Clone the application 

Using SSH:
```
git clone https://github.com/victorsteven/Premier-League.git
```

#### Change to the application directory:
```
cd Premier-League
```
### Install Dependencies
```
npm install
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
