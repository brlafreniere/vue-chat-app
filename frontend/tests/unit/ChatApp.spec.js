import { shallowMount } from '@vue/test-utils'
import ChatApp from '@/components/ChatApp.vue'

function dummyUserResponse () {
    return { 
        data: {
            "id":19,
            "created_at":"2019-10-09T16:50:45.219Z",
            "updated_at":"2019-10-09T16:52:29.378Z",
            "chat_rooms":[
                {
                    "id":1,
                    "created_at":"2019-08-07T16:30:24.431Z",
                    "updated_at":"2019-08-07T16:30:24.431Z",
                    "name":"General"
                }
            ],
            "nickname":"rando_499",
            "url":"http://lab.lizardgizzards.com:4000/users/19.json"
        }
    }
}

function dummyMessage () {
    return {"id":136,"text":"asdfasdf","nickname":"John","created_at":"2019-10-08T18:06:28.086Z","user_id":18,"chat_room_id":1}
}

function getWrapper () {
    const wrapper = shallowMount(ChatApp, {
        mocks: {
            $cookies: { get: () => { return 'foobar' } },
            $socket: { emit: (event) => { } },
            axios: { 
                get: () => { return dummyUserResponse() } ,
                post: () => { return dummyMessage() }
            },
            $cable: { subscribe: () => {} }
        },
    })
    return wrapper
}

describe('ChatApp.vue', () => {
    it('mounts without errors', () => {
        const wrapper = getWrapper()
    })
    it('loads room messages without error', () => {
    })
})
