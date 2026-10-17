import { SteamAppOverview, TagOverrideDict } from '@types'
import { useMemo } from 'react'
import { GameEntry } from './GameEntry'
import { useTabMasterContext } from '@state'

type TagOverridesProps = {
    tagOverrides: TagOverrideDict
    appsMap: Record<string, SteamAppOverview>
    setTagOverrides: (overrides: TagOverrideDict) => Promise<void | Error>
}

export const TagOverrides = ({ tagOverrides, appsMap, setTagOverrides }: TagOverridesProps) => {
    const { allStoreTags } = useTabMasterContext()
    const selectedAppIds = useMemo(() => Object.keys(tagOverrides), [tagOverrides])

    const gamesWithOverrides = useMemo(() => {
        return selectedAppIds.map(appid => {
            return {
                appid: appid,
                override: tagOverrides[appid],
                name: appsMap[appid]?.display_name ?? '',
            }
        })
    }, [selectedAppIds, tagOverrides, appsMap])

    return (
        <div className='tag-overrides'>
            {gamesWithOverrides.map(game => (
                <GameEntry
                    key={`${game.appid}|${game.name}`}
                    tags={allStoreTags}
                    appid={game.appid}
                    overrides={game.override}
                    name={game.name}
                    onChange={(appid, overrides) => {
                        const newTagOverrides = { ...tagOverrides }
                        if (overrides === null) {
                            delete newTagOverrides[appid]
                        } else {
                            newTagOverrides[appid] = overrides
                        }

                        setTagOverrides(newTagOverrides)
                    }}
                />
            ))}
        </div>
    )
}
