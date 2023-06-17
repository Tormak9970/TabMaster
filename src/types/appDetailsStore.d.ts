// Types for the appDetailsStore global

type AppDetailsStore = {
	RegisterForAppData: (app_id: number, handler: (details: AppDetails) => void) => { unregister: () => void }
}