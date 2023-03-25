const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const sharp = require('sharp')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch (e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

const upload = multer({
    // dest: './src/avatars',
    limits: {
        fileSize: 1000000
    }, 
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be an image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'),async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250}).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({Error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
    
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById('req.params.id')

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})

router.get('/users/me', auth,  async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidUpdateField = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdateField) {
        res.status(400).send({ error: 'Invalid Updates'})
    }

    try {
        //does not support middleware
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        // const user = await User.findById(req.user._id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        await req.user.save()

        res.send(req.user)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await User.deleteOne({_id: req.user._id})
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

module.exports = router