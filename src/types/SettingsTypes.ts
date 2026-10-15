export type TagOverride = {
    /**
     * **True**: *Add this tag to app*
     *
     * **False**: *Remove this tag from app*
     */
    method: boolean
    tagNumber: number
}

export type TagOverrideDict = Record<string, TagOverride>
