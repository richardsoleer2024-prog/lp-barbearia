import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Servicos from '../components/Servicos'
import Portfolio from '../components/Portfolio'
import Agendamento from '../components/Agendamento'

interface Props {
  onAbrirPainel: () => void
}

export default function Site({ onAbrirPainel }: Props) {
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null)
  const agendarRef = useRef<HTMLDivElement>(null)

  function scrollAgendar() {
    document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })
  }

  function scrollPortfolio() {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleServico(id: number) {
    setServicoSelecionado(id)
    setTimeout(() => document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div>
      <Navbar onAgendar={scrollAgendar} onAbrirPainel={onAbrirPainel} />
      <Hero onAgendar={scrollAgendar} onPortfolio={scrollPortfolio} />
      <Servicos selecionado={servicoSelecionado} onSelecionar={handleServico} />
      <Portfolio />
      <div ref={agendarRef}>
        <Agendamento servicoInicial={servicoSelecionado ?? undefined} />
      </div>
      <footer style={{
        background: 'var(--bg2)', borderTop: '0.5px solid var(--border)',
        padding: '32px 20px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--gold)', marginBottom: 6 }}>
          LP Barbearia
        </div>
        <div style={{ fontSize: 13, color: 'var(--text3)' }}>
          Florianópolis, SC · Ter–Dom das 8h às 20h
        </div>
      </footer>
    </div>
  )
}
