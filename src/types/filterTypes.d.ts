type FilterType = 'collection' | 'installed' | 'regex'
type CollectionFilterParams = { collection: SteamCollection['id'] }
type InstalledFilterParams = { installed: boolean }
type RegexFilterParams = { regex: string }

type FilterParams<T extends FilterType> =
    T extends 'collection' ? CollectionFilterParams :
    T extends 'installed' ? InstalledFilterParams :
    T extends 'regex' ? RegexFilterParams :
    never

type TabFilterSettings<T extends FilterType> = {
    type: T
    params: FilterParams<T>
}