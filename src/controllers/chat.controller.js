import { messageModel } from "../models/messages.models.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await messageModel.find().sort({ postTime: 1 }).lean();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener mensajes del chat" });
    }
}

export const postMessages = async (req, res) => {
    const { email, message } = req.body;

    try {
        const newMessage = new messageModel({ email, message });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: "Error al enviar mensaje al chat" });
        console.log(error)
    }
}