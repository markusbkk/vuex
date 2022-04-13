import {Commit, createLogger, createStore, Mutation, Store} from "@visitsb/vuex";
import api from "../api";
import {Message, Messages, Thread, Threads} from "../types";

export interface State {
    currentThreadId: Nullable<string>,
    threads: Threads,
    messages: Messages
}

const store: Store<State> = createStore({
    strict: true,
    state: (): State => ({
        currentThreadId: null,
        threads: {},
        messages: {}
    }),
    getters: {
        currentThread: ({currentThreadId, threads}) => currentThreadId ? threads[currentThreadId] : {name: 'Messages'},
        currentMessages: ({messages}, getters): Message[] => {
            const thread: Thread = getters.currentThread
            return thread.messages
                ? thread.messages.map(id => messages[id])
                : []
        },
        unreadCount: ({threads}): number => Object.keys(threads).reduce((count, id): number => ((threads[id].lastMessage && threads[id].lastMessage!.isRead) ? count : count + 1), 0),
        sortedMessages: (_, {currentMessages}: { currentMessages: Message[] }): Message[] => currentMessages.slice().sort((a: Message, b: Message) => (a.timestamp - b.timestamp))
    },
    mutations: {
        addMessage(state: State, message: Message): void {
            // add a `isRead` field before adding the message
            message.isRead = (message.threadId === state.currentThreadId)
            // add it to the thread it belongs to
            const thread = state.threads[message.threadId]
            if (!thread.messages.some((id) => (id === message.id))) {
                thread.messages.push(message.id)
                thread.lastMessage = message
            }
            // add it to the messages map
            state.messages = {
                ...state.messages,
                [message.id]: message
            }
        },
        createThread(state: State, {id, name}: { id: string, name: string }): void {
            const newThread: Threads = {}
            newThread[id] = {id, name, messages: [], lastMessage: null}

            state.threads = {...state.threads, ...newThread}
        },
        setCurrentThread(state: State, id: string): void {
            state.currentThreadId = id
            if (!state.threads[id]) {
                console.error("Something isn't right here")
            }
            // mark thread as read
            state.threads[id].lastMessage!.isRead = true
        }
    },
    actions: {
        async getAllMessages({state, commit}: { state: State, commit: Commit }) {
            const messages: Message[] = await api.getAllMessages()
            let latestMessage: Message

            messages.forEach((message) => {
                // create new thread if the thread doesn't exist
                if (!state.threads[message.threadId]) {
                    commit('createThread', {id: message.threadId, name: message.threadName})
                }
                // mark the latest message
                if (!latestMessage || message.timestamp > latestMessage.timestamp) {
                    latestMessage = message
                }
                // add message
                commit('addMessage', message)
            })

            // set initial thread to the one with the latest message
            commit('setCurrentThread', latestMessage!.threadId)
        },
        async receiveMessage({commit}: { commit: Commit }, payload) {
            const message: Message = await api.createMessage(payload)
            commit('addMessage', message)
        },
        async sendMessage({commit}: { commit: Commit }, payload) {
            const message: Message = await api.createMessage(payload)
            commit('addMessage', message)
        },
        async switchThread({commit}: { commit: Commit }, {id}: Partial<Thread>) {
            commit('setCurrentThread', id)
        }
    },
    plugins: [
        createLogger<State>({
            collapsed: true,
            transformer: () => '...', // Skip log for state
            actionTransformer: JSON.stringify,
            mutationTransformer: JSON.stringify
        })
    ]
})

export default store;