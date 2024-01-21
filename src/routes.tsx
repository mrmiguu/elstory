import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import ChapterCollection from './ChapterCollection'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'chapters',
        element: <ChapterCollection />,
      },
    ],
  },
])
