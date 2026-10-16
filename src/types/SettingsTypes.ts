export type TagOverride = {
    /**
     * **True**: *Add this tag to app*
     *
     * **False**: *Remove this tag from app*
     */
    [tagNumber: number]: boolean
}

/**
 * @example
 * {
 *    "1086940": {
 *      // Treat BG3 as tho it had tag #1
 *      "1": true
 *    }
 * }
 */
export type TagOverrideDict = Record<string, TagOverride>
