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
    url: 'sketchin',
    videoID: 'skReel'
  },
  {
    name: 'Evaluation Criteria',
    url: 'aquest',
    videoID: 'aqReel'
  },
  {
    name: 'FAQ',
    url: 'fastweb',
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
