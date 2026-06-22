'use client'

import { useEffect, useMemo, useState } from 'react'
import flashcardsData from '../data/flashcards.json'

const STATUS_LABEL = {
  bien: 'Bien',
  regular: 'Más o menos',
  mal: 'Mal'
}

export default function Home() {
  const cards = flashcardsData.cards
  const [review, setReview] = useState({})
  const [topic, setTopic] = useState('Todo')
  const [showBack, setShowBack] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const saved = window.localStorage.getItem('flashcard-review')
    if (saved) {
      try {
        setReview(JSON.parse(saved))
      } catch {
        setReview({})
      }
    }
  }, [])

  const topics = useMemo(
    () => ['Todo', ...new Set(cards.map((card) => card.tema))],
    [cards]
  )

  const filteredCards = useMemo(
    () => (topic === 'Todo' ? cards : cards.filter((card) => card.tema === topic)),
    [cards, topic]
  )

  useEffect(() => {
    if (index >= filteredCards.length) {
      setIndex(0)
      setShowBack(false)
    }
  }, [filteredCards, index])

  const currentCard = filteredCards[index] || null

  const saveReview = (id, status) => {
    const next = { ...review, [id]: status }
    setReview(next)
    window.localStorage.setItem('flashcard-review', JSON.stringify(next))
  }

  const counts = useMemo(() => {
    const values = Object.values(review)
    return {
      bien: values.filter((value) => value === 'bien').length,
      regular: values.filter((value) => value === 'regular').length,
      mal: values.filter((value) => value === 'mal').length
    }
  }, [review])

  const pendingHigh = useMemo(
    () => cards.filter((card) => card.prioridad === 'alta' && !review[card.id]).slice(0, 5),
    [cards, review]
  )

  const onSelectCard = (selectedIndex) => {
    setIndex(selectedIndex)
    setShowBack(false)
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div>
          <span className="badge">Flashcards</span>
          <h1>Flashcards de Sistemas de Información</h1>
          <p>
            Repasa las tarjetas, marca si lo hiciste bien, más o menos o mal, y guarda tu progreso en localStorage.
          </p>
        </div>
        <div className="summary-box">
          <div>
            <strong>{cards.length}</strong>
            <span>Total de tarjetas</span>
          </div>
          <div>
            <strong>{counts.bien}</strong>
            <span>Bien</span>
          </div>
          <div>
            <strong>{counts.regular}</strong>
            <span>Más o menos</span>
          </div>
          <div>
            <strong>{counts.mal}</strong>
            <span>Mal</span>
          </div>
        </div>
      </section>

      <section className="controls">
        <div>
          <label htmlFor="topic">Tema:</label>
          <select
            id="topic"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value)
              setIndex(0)
              setShowBack(false)
            }}
          >
            {topics.map((topicOption) => (
              <option key={topicOption} value={topicOption}>
                {topicOption}
              </option>
            ))}
          </select>
        </div>

        <div className="priority-tip">
          <strong>Prioridad alta sin revisar:</strong>
          {pendingHigh.length > 0 ? (
            <ul>
              {pendingHigh.map((card) => (
                <li key={card.id}>#{card.id} {card.front}</li>
              ))}
            </ul>
          ) : (
            <span>Ya no quedan tarjetas alta por revisar.</span>
          )}
        </div>
      </section>

      {currentCard ? (
        <section className="card-area">
          <div className="card-card">
            <div className="card-meta">
              <span className={`priority ${currentCard.prioridad}`}>{currentCard.prioridad}</span>
              <span>{currentCard.tema}</span>
            </div>
            <div className="card-content">
              <p>{showBack ? currentCard.back : currentCard.front}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => setShowBack((value) => !value)} className="secondary">
                Ver {showBack ? 'frente' : 'atrás'}
              </button>
              <div className="status-buttons">
                {Object.entries(STATUS_LABEL).map(([statusKey, label]) => (
                  <button
                    key={statusKey}
                    className={review[currentCard.id] === statusKey ? 'active' : ''}
                    onClick={() => saveReview(currentCard.id, statusKey)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-footer">
              <span>Estado: {review[currentCard.id] ? STATUS_LABEL[review[currentCard.id]] : 'Sin revisar'}</span>
              <span>
                Tarjeta {index + 1} de {filteredCards.length}
              </span>
            </div>
          </div>

          <div className="navigation-row">
            <button onClick={() => onSelectCard(Math.max(0, index - 1))} disabled={index === 0}>
              Anterior
            </button>
            <button onClick={() => onSelectCard(Math.min(filteredCards.length - 1, index + 1))} disabled={index === filteredCards.length - 1}>
              Siguiente
            </button>
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <p>No hay tarjetas en este tema.</p>
        </section>
      )}

      <section className="list-area">
        <h2>Lista de tarjetas</h2>
        <div className="grid-list">
          {filteredCards.map((card, cardIndex) => (
            <button
              key={card.id}
              className={`list-card ${review[card.id] ? review[card.id] : ''} ${cardIndex === index ? 'selected' : ''}`}
              onClick={() => onSelectCard(cardIndex)}
            >
              <div className="list-card-top">
                <span className={`priority ${card.prioridad}`}>{card.prioridad}</span>
                <span>{STATUS_LABEL[review[card.id]] || 'Sin revisar'}</span>
              </div>
              <p>{card.front}</p>
              <small>{card.tema}</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
