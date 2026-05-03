import express, { Request, Response } from 'express'
import path from 'path'

const app = express()
const PORT = parseInt(process.env.PORT || '3000', 10)
const DIST_DIR = path.join(__dirname, 'dist')

// Health endpoint — must respond independently of React initialization
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Static assets with long-term cache (1 year)
app.use(
  '/assets',
  express.static(path.join(DIST_DIR, 'assets'), {
    maxAge: '1y',
    immutable: true,
  }),
)

// All other static files with no-cache
app.use(
  express.static(DIST_DIR, {
    maxAge: 0,
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      }
    },
  }),
)

// SPA fallback — serve index.html for all unmatched routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'))
})

app.use((err: Error, _req: Request, res: Response) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
