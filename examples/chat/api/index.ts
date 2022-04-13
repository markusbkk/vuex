import data from "./mock-data";
import {Message, Thread} from "../types";

const api = (() => {
    const LATENCY: number = 16

    const getAllMessages = async (): Promise<Message[]> => new Promise((resolve) => setTimeout(() => {
        resolve(data)
    }, LATENCY))

    const createMessage = async ({
                                     text,
                                     thread
                                 }: { text: string, thread: Thread }): Promise<Message> => new Promise((resolve) => {
        const timestamp: number = Date.now()
        const id: string = 'm_' + timestamp
        const message: Message = {
            id,
            text,
            timestamp,
            threadId: thread.id,
            threadName: thread.name,
            authorName: 'Evan',
            isRead: false
        }

        setTimeout(function () {
            resolve(message)
        }, LATENCY)
    })

    return {
        getAllMessages, createMessage
    }
})()

export default api
