import { shallowMount } from '@vue/test-utils'
import NicknameDisplay from '@/components/NicknameDisplay.vue'

describe("NicknameDisplay.vue", () => {
    it("mounts without errors", () => {
        shallowMount(NicknameDisplay, {
            mocks: {
                $store: {
                    state: {
                        current_user: {
                            nickname: "Fart Boy"
                        }
                    }
                }
            }
        })
    })

    it("Displays nickname properly")
})