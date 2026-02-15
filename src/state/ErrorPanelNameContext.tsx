import { createContext } from 'react'

/**
 * Context for tab name in error panel
 */
export const ErrorPanelTabNameContext = createContext<string | null>(null)
