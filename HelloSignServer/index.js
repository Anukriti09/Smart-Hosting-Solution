const express = require('express')
const app = express()
const port = 3003
const bodyParser = require('body-parser');
const {generatePDF,sendSignatureRequest,downloadFile,getPendingList} = require('./HelloSignUtils')
app.use('/', express.static('public'));
app.set("view engine","ejs");

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// support parsing of application/json type post data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send("hii")
})

app.post('/sendSignature', async (req, res) => {
  let fileName='./temp.pdf';
  console.log(fileName)
    await generatePDF(req.body.imgsrc,fileName);
    const signer = {
      email_address: req.body.Email,
      name: req.body.Name,
    };
    let files=[fileName]
    sendSignatureRequest(signer,req.body.Title,req.body.Sub,req.body.Mess,files)
  })

  app.get('/getPendingList', async (req, res) => {
    let list=await getPendingList()
    res.send(list)

  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})