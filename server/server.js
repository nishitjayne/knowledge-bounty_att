const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/knowledgeBountyDB')
    .then(() => console.log("✅ Database Active"))
    .catch(err => console.error("❌ DB Failed:", err));

const BountySchema = new mongoose.Schema({
    title: { type: String, required: true },
    reward: { type: String, required: true },
    category: { type: String, enum: ['Engineering', 'Sales', 'HR', 'Creative'], default: 'Engineering' },
    timeEstimate: { type: String, enum: ['5M', '15M', '30M'], default: '15M' },
    points: { type: Number, default: 50 },
    requesterName: { type: String, default: 'Sarah J.' },
    status: { type: String, enum: ['open', 'claimed', 'resolved'], default: 'open' },
    proposedTime: { type: String, default: null },
    meetingStatus: { type: String, enum: ['none', 'proposed', 'agreed'], default: 'none' },
    messages: [{ sender: String, text: String, time: { type: Date, default: Date.now } }]
});

const Bounty = mongoose.model('Bounty', BountySchema);

const SLACK_WEBHOOK = "YOUR_WEBHOOK_URL_HERE"; 

const notifySlack = async (type, data) => {
    let text = type === 'new' ? `💡 *New Bounty!* ${data.title}` : `🎉 *Solved!* ${data.title}`;
    await axios.post(SLACK_WEBHOOK, { text }).catch(() => null);
};

app.get('/api/bounties', async (req, res) => res.json(await Bounty.find().sort({ _id: -1 })));

app.post('/api/bounties', async (req, res) => {
    try {
        const newB = new Bounty(req.body);
        await newB.save();
        notifySlack('new', newB);
        res.status(201).json(newB);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/bounties/:id/:action', async (req, res) => {
    try {
        const status = req.params.action === 'claim' ? 'claimed' : 'resolved';
        const data = await Bounty.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (req.params.action === 'resolve') notifySlack('success', data);
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/bounties/:id/schedule', async (req, res) => {
    const data = await Bounty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
});

app.post('/api/bounties/:id/chat', async (req, res) => {
    const data = await Bounty.findByIdAndUpdate(req.params.id, { $push: { messages: req.body } }, { new: true });
    res.json(data);
});

app.listen(5000, () => console.log("🚀 Server running on Port 5000"));