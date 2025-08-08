import { createModel } from '@rematch/core'
import type { RootModel } from '../models'

type Project = {
  name: string
  url: string
  videoID: string
}

const initialState: Project[] = [
  {
    name: 'Guidelines',
    url: 'guidelines',
    videoID: 'skReel'
  },
  {
    name: 'Evaluation Criteria',
    url: 'criteria',
    videoID: 'aqReel'
  },
  {
    name: 'FAQ',
    url: 'faq',
    videoID: 'fbReel'
  },
  // {
  //   name: 'Feudi',
  //   url: 'feudi',
  //   videoID: 'feudiReel'
  // },
  // {
  //   name: 'Claraluna',
  //   url: 'claraluna',
  //   videoID: 'claralunaReel'
  // }
]

export const projects = createModel<RootModel>()({
  state: initialState
})
