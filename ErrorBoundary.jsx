import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[ui] Unhandled render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p className="muted" style={{ maxWidth: 520, margin: '12px auto 24px' }}>
            The page hit an unexpected error. Your report was not submitted. If an animal is in immediate danger,
            call <a href="tel:112">112</a> now.
          </p>
          <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload the page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
