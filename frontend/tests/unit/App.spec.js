import { shallowMount } from '@vue/test-utils'
import App from '@/App.vue'

describe('ChatApp.vue', () => {
    it("mounts without errors", () => {
        shallowMount(App, {
            mocks: {
                $cookies: {
                    get: () => {},
                    set: () => {}
                },
                $store: {
                    commit: () => {},
                    dispatch: () => {}
                },
                axios: {
                    get: () => {}
                }
            }
        })
    })
})