import { mount, VueWrapper } from '@vue/test-utils'
import ListShuffle from '../lib'

test('Renders list shuffle', () => {
  const wrapper: VueWrapper = mount(ListShuffle as never)

  wrapper.exists()
})

