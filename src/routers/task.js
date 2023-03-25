const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        owner: req.user._id,
        ...req.body
    })
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//fetch the first page of 2->limit=2&skip=0 and the third page of 2->limit=2&skip=4
//fetch the first page of 3->limit=3&skip=0 and the second page of 3->limit=3&skip=3
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    // Task.find().then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })

    try {
        // const tasks = await Task.find({ owner: req.user._id})
        //res.send(tasks)

        //or we can do

        // await req.user.populate('tasks')
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send()
    // })

    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdateField = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidUpdateField) {
        res.status(400).send({ error: 'Invalid Updates'})
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task) {
            res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch(e) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router