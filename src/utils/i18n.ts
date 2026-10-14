// TODO: imports go here
import cs from '@localization/cs_CZ.json'
import da from '@localization/da_DK.json'
import de from '@localization/de_DE.json'
import fi from '@localization/fi_FI.json'
import el from '@localization/el_GR.json'
import es from '@localization/es_ES.json'
import es419 from '@localization/ca_ES.json'
import fr from '@localization/fr_FR.json'
import it from '@localization/it_IT.json'
import ja from '@localization/ja_JP.json'
import ko from '@localization/ko_KR.json'
import nl from '@localization/nl_NL.json'
import pl from '@localization/pl_PL.json'
import pt from '@localization/pt_PT.json'
import ptBr from '@localization/pt_BR.json'
import ro from '@localization/ro_RO.json'
import ru from '@localization/ru_RU.json'
import sv from '@localization/sv_SE.json'
import tr from '@localization/tr_TR.json'
import uk from '@localization/uk_UA.json'
import zh from '@localization/zh_CN.json'
import zhTw from '@localization/zh_TW.json'
import no from '@localization/no_NO.json'
import hu from '@localization/hu_HU.json'
import th from '@localization/tr_TR.json'
import vn from '@localization/vi_VN.json'

const simplifiedChinese = {
    name: '简体中文',
    strings: zh,
    credit: ['Charles Lew'],
}

export type LanguageConfig = {
    name: string
    strings: Record<string, string>
    credit: string[]
}

export const LANGS: Record<string, LanguageConfig> = {
    cs: {
        name: 'Čeština',
        strings: cs,
        credit: [],
    },
    da: {
        name: 'Dansk',
        strings: da,
        credit: [],
    },
    de: {
        name: 'Deutsch',
        strings: de,
        credit: [],
    },
    fi: {
        name: 'Suomi',
        strings: fi,
        credit: [],
    },
    el: {
        name: 'Ελληνικά',
        strings: el,
        credit: [],
    },
    es: {
        name: 'Español-España',
        strings: es,
        credit: ['Sebastian Guardo Lugo'],
    },
    'es-419': {
        name: 'Español-Latinoamérica',
        strings: es419,
        credit: [],
    },
    fr: {
        name: 'Français',
        strings: fr,
        credit: [],
    },
    it: {
        name: 'Italiano',
        strings: it,
        credit: ['Lemon64k'],
    },
    ja: {
        name: '日本語',
        strings: ja,
        credit: [],
    },
    ko: {
        name: '한국어',
        strings: ko,
        credit: [],
    },
    nl: {
        name: 'Nederlands',
        strings: nl,
        credit: [],
    },
    pl: {
        name: 'Polski',
        strings: pl,
        credit: [],
    },
    pt: {
        name: 'Português',
        strings: pt,
        credit: [],
    },
    'pt-br': {
        name: 'Português-Brasil',
        strings: ptBr,
        credit: ['Alberto Eberhardt'],
    },
    ro: {
        name: 'Română',
        strings: ro,
        credit: [],
    },
    ru: {
        name: 'Русский',
        strings: ru,
        credit: ['Vladimir Budylnikov'],
    },
    sv: {
        name: 'Svenska',
        strings: sv,
        credit: [],
    },
    tr: {
        name: 'Türkçe',
        strings: tr,
        credit: [],
    },
    uk: {
        name: 'Українська',
        strings: uk,
        credit: ['Костя'],
    },
    'zh-cn': simplifiedChinese,
    'sc-sc': simplifiedChinese, // sc-sc is "SteamChina" i think?, it's mapped to zh-cn in the client so doing the same here.
    'zh-tw': {
        name: '正體中文',
        strings: zhTw,
        credit: [],
    },
    no: {
        name: 'Norsk',
        strings: no,
        credit: [],
    },
    hu: {
        name: 'Magyar',
        strings: hu,
        credit: [],
    },
    th: {
        name: 'ไทย',
        strings: th,
        credit: [],
    },
    // bg: {
    //   name: 'български език',
    //   strings: bg,
    //   credit: []
    // },
    // en: {
    //   name: 'English',
    //   strings: en,
    //   credit: []
    // }
    vn: {
        name: 'Tiếng Việt',
        strings: vn,
        credit: [],
    },
    // id: {
    //   name: 'Bahasa Indonesia',
    //   strings: id,
    //   credit: []
    // },
}

let cachedLang: string | undefined
const getCurrentLanguage = (): string => {
    if (cachedLang) return cachedLang

    const lang = window.LocalizationManager.m_rgLocalesToUse[0]
    cachedLang = lang
    return lang
}

export const getCredits = (lang?: string) => {
    if (lang) return LANGS[lang]?.credit
    return LANGS[getCurrentLanguage()]?.credit
}

export const getLanguageName = (lang?: string): string => {
    if (lang) return LANGS[lang]?.name
    return LANGS[getCurrentLanguage()]?.name
}

/**
 * Very basic translation cause theres like 20 strings and i don't need anything more complex.
 *
 * @param key Locale key
 * @param originalString Original text
 * @param steamToken If true, uses the key to query Steams token store.
 *    Good for actions like "Back" or "Cancel". Won't be dumped with the rest of the strings.
 *
 * @example
 * t('TITLE_FILTER_MODAL', 'Asset Filters')
 * @example
 * // if you need variables use .replace()
 * t('ACTION_REMOVE_GAME', 'Delete {gameName}').replaceAll('{gameName}', gameName)
 * @example
 * // Original Steam string
 * t('Button_Back', 'Back', true);
 */
export const trans_string = (key: string, originalString: string, steamToken = false): string => {
    const lang = getCurrentLanguage()
    if (steamToken) {
        return (
            window.LocalizationManager.m_mapTokens.get(key) ??
            window.LocalizationManager.m_mapFallbackTokens.get(key) ??
            originalString
        )
    }
    if (lang === 'en') return originalString

    return LANGS[lang]?.strings?.[key] ?? originalString
}

// using "trans_string" so it can be found by dump-strings
export default trans_string
