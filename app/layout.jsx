import './globals.css'

export const metadata = {
  title: 'Flashcards SI',
  description: 'App de flashcards con localStorage para seguimiento de repaso.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
