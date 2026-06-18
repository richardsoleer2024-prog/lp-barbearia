import { useState } from 'react'
import Site from './pages/Site'
import Painel from './pages/Painel'

export type View = 'site' | 'painel'

export default function App() {
  const [view, setView] = useState<View>('site')

  return view === 'site'
    ? <Site onAbrirPainel={() => setView('painel')} />
    : <Painel onVoltar={() => setView('site')} />
}
