import './globals.css'

export const metadata = {
  title: 'Flashcards SI',
  description: 'App de flashcards con localStorage para seguimiento de repaso.',
  viewport: 'width=device-width, initial-scale=1'
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
