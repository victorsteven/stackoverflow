import app from './app/app'

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("this is the app we are building")
 console.log(`Server is running on PORT ${port}`);
})
