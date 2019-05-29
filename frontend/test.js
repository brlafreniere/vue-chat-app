import { mount } from '@vue/test-utils'
import ChatApp from './src/components/Chatapp.vue'

describe('Component', () => {
    test('is a Vue instance', () => {
        const wrapper = mount(ChatApp)
        expect(wrapper.isVueInstance()).toBeTruthy()
    })
})

