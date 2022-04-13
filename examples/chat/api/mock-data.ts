import {Message} from "../types";

const data: Message[] = [
    {
        id: 'm_1',
        threadId: 't_1',
        threadName: 'Mike and Bill',
        authorName: 'Bill',
        text: 'Hey Mike, want to give a Flux talk at ForwardJS?',
        timestamp: Date.now() - 99999,
        isRead: false
    },
    {
        id: 'm_2',
        threadId: 't_1',
        threadName: 'Mike and Bill',
        authorName: 'Bill',
        text: 'Seems like a pretty cool conference.',
        timestamp: Date.now() - 89999,
        isRead: false
    },
    {
        id: 'm_3',
        threadId: 't_1',
        threadName: 'Mike and Bill',
        authorName: 'Mike',
        text: 'Sounds good.  Will they be serving dessert?',
        timestamp: Date.now() - 79999,
        isRead: false
    },
    {
        id: 'm_4',
        threadId: 't_2',
        threadName: 'Dave and Bill',
        authorName: 'Bill',
        text: 'Hey Dave, want to get a beer after the conference?',
        timestamp: Date.now() - 69999,
        isRead: false
    },
    {
        id: 'm_5',
        threadId: 't_2',
        threadName: 'Dave and Bill',
        authorName: 'Dave',
        text: 'Totally!  Meet you at the hotel bar.',
        timestamp: Date.now() - 59999,
        isRead: false
    },
    {
        id: 'm_6',
        threadId: 't_3',
        threadName: 'Functional Heads',
        authorName: 'Bill',
        text: 'Hey Brian, are you going to be talking about functional stuff?',
        timestamp: Date.now() - 49999,
        isRead: false
    },
    {
        id: 'm_7',
        threadId: 't_3',
        threadName: 'Bill and Brian',
        authorName: 'Brian',
        text: 'At ForwardJS?  Yeah, of course.  See you there!',
        timestamp: Date.now() - 39999,
        isRead: false
    }
]

export default data