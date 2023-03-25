const express = require('express')
require("./db/mongoose.js")
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

const app = express()

app.use(express.json())

// app.use((req, res, next) => {
//     res.status(503).send('Site under maintainance')
// })

app.use(userRouter)
app.use(taskRouter)

//example of populating data
// const User = require('./models/user')
// const Task = require('./models/task')

// const main = async () => {
//     // const task = await Task.findById('6401efb702d0142e2967a531')
//     // await task.populate('owner')
//     // console.log(task.owner)

//     const user = await User.findById('6401e6dabc69d891ece4ef71')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()

//Example of image upload
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         //allow only pdf files
//         // if(!file.originalname.endsWith('pdf')) {
//         //     return cb(new Error('File must be a pdf'))
//         // }

//         // cb(undefined, true)

//         //allow doc or docx files only
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('File must be word document'))
//         }

//         cb(undefined, true)

//         // cb(New Error(''File must be a pdf))
//         // cb(undefined, true)
//         // cb(undefined, false)
//     }
// })
// app.post('/uploads', upload.single('upload'), (req, res) => {
//     res.send()
// })

//add this tag to html on jsbin to load saved img in db using binary data
{/* <img src="data:image/jpg:base64, binary string> */}

module.exports = app