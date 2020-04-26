const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

app.get('/payments', function (req, res, next) {
  res.status(200).send({msg: 'Successful payment'})
})

app.listen(5500, () => {
  console.log('The application is started at port 5500')
})
