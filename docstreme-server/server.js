const mongoose = require("mongoose")
const Document = require("./Document")

// const con = mongoose.connect("mongodb+srv://docstream:docstream@cluster0.vyiaiur.mongodb.net/?retryWrites=true&w=majority", {
const con = mongoose.connect("mongodb://0.0.0.0:27017/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
if (con) console.log("connected")

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const defaultValue = ""

io.on("connection", socket => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId)
    socket.join(documentId)
    socket.emit("load-document", document.data)

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta)
    })

    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data })
    })
    socket.on('edited-document', async (data) => {
      console.log(data)
      const res = await Document.updateOne({ _id: documentId }, {
        $push: { updates: data }
      })
      console.log(res)
    })
  })
  socket.on("send-updates", async (documentId) => {
    console.log(documentId)
    const res = await Document.find({ _id: documentId }, { updates: 1 })
    console.log(res)
    socket.emit("updates", res[0].updates)
  })
})

async function findOrCreateDocument(id) {
  if (id == null) return

  const document = await Document.findById(id)
  if (document) return document
  return await Document.create({ _id: id, data: defaultValue })
}