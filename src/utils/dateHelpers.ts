const locales = window.LocalizationManager.m_rgLocalesToUse

export function dateToLabel(year: number, month?: number, day?: number, formatOptions?: Intl.DateTimeFormatOptions) {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }

    let _options: Intl.DateTimeFormatOptions

    if (formatOptions?.dateStyle) {
        switch (formatOptions?.dateStyle) {
            case 'full':
                _options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                }
                break

            case 'long':
                _options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }
                break

            case 'medium':
                _options = {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }
                break

            case 'short':
                _options = {
                    year: '2-digit',
                    month: 'numeric',
                    day: 'numeric',
                }
                break

            default:
                _options = defaultOptions
        }
    } else {
        _options = formatOptions ?? defaultOptions
    }

    if (month === undefined) {
        delete _options.month
    }
    if (day === undefined) {
        delete _options.day
        delete _options.weekday
    }

    const date = new Date(year, (month ?? 1) - 1, day ?? 1).toLocaleDateString(locales, _options)
    return date
}
