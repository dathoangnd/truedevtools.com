import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Router } from './routes/Router/Router.component'
import AnalyticsProvider from './providers/AnalyticsProvider/AnalyticsProvider.component'
import store from './store'

import './index.scss'
import ThemeProvider from './providers/ThemeProvider/ThemeProvider.component'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AnalyticsProvider>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </ReduxProvider>
    </AnalyticsProvider>
  </React.StrictMode>,
)
