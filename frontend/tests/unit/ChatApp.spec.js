import { shallowMount } from '@vue/test-utils'
import ChatApp from '@/components/ChatApp.vue'

describe('ChatApp.vue', () => {
    it('mounts without errors', () => {
        const wrapper = shallowMount(ChatApp, {
            mocks: {
                $cookies: {
                    get: () => { return 'foobar' }
                },
                $socket: {
                    emit: (event) => { }
                }
            },
        })
    })
})
