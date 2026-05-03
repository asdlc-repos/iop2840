import { Component, ErrorInfo, ReactNode } from 'react'
import './App.css'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('React error boundary caught:', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#cc0000' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error?.message}</p>
        </div>
      )
    }
    return this.props.children
  }
}

function HelloWorld(): JSX.Element {
  return (
    <main className="container">
      <h1 className="heading">Hello World</h1>
    </main>
  )
}

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <HelloWorld />
    </ErrorBoundary>
  )
}
