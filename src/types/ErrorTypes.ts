export type FilterErrorEntry = {
    filterIdx: number
    errors: string[]
    mergeErrorEntries?: FilterErrorEntry[]
}

export type ValidationResponse = {
    passed: boolean
    errors: string[]
    mergeErrorEntries?: FilterErrorEntry[]
}
