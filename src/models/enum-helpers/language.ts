import { Locale } from 'discord.js';

interface LanguageData {
    /** The language name in English. */
    englishName: string;
    /** The language name in its native form/script. */
    nativeName: string;
}

/**
 * The default locale to use when none is specified.
 */
export const DefaultLocale = Locale.EnglishUS;

/**
 * List of enabled locales that are supported/allowed in the application.
 */
export const EnabledLocales: Locale[] = [Locale.EnglishUS, Locale.SpanishLATAM];

/**
 * Mapping from locale codes to language metadata.
 * Contains the English and native names for each supported locale.
 * See https://discord.com/developers/docs/reference#locales for reference.
 */
export const Language: Record<Locale, LanguageData> = {
    bg: { englishName: 'Bulgarian', nativeName: 'български' },
    cs: { englishName: 'Czech', nativeName: 'Čeština' },
    da: { englishName: 'Danish', nativeName: 'Dansk' },
    de: { englishName: 'German', nativeName: 'Deutsch' },
    el: { englishName: 'Greek', nativeName: 'Ελληνικά' },
    'en-GB': { englishName: 'English, UK', nativeName: 'English, UK' },
    'en-US': { englishName: 'English, US', nativeName: 'English, US' },
    'es-419': { englishName: 'Spanish, LATAM', nativeName: 'Español, LATAM' },
    'es-ES': { englishName: 'Spanish', nativeName: 'Español' },
    fi: { englishName: 'Finnish', nativeName: 'Suomi' },
    fr: { englishName: 'French', nativeName: 'Français' },
    hi: { englishName: 'Hindi', nativeName: 'हिन्दी' },
    hr: { englishName: 'Croatian', nativeName: 'Hrvatski' },
    hu: { englishName: 'Hungarian', nativeName: 'Magyar' },
    id: { englishName: 'Indonesian', nativeName: 'Bahasa Indonesia' },
    it: { englishName: 'Italian', nativeName: 'Italiano' },
    ja: { englishName: 'Japanese', nativeName: '日本語' },
    ko: { englishName: 'Korean', nativeName: '한국어' },
    lt: { englishName: 'Lithuanian', nativeName: 'Lietuviškai' },
    nl: { englishName: 'Dutch', nativeName: 'Nederlands' },
    no: { englishName: 'Norwegian', nativeName: 'Norsk' },
    pl: { englishName: 'Polish', nativeName: 'Polski' },
    'pt-BR': { englishName: 'Portuguese, Brazilian', nativeName: 'Português do Brasil' },
    ro: { englishName: 'Romanian, Romania', nativeName: 'Română' },
    ru: { englishName: 'Russian', nativeName: 'Pусский' },
    'sv-SE': { englishName: 'Swedish', nativeName: 'Svenska' },
    th: { englishName: 'Thai', nativeName: 'ไทย' },
    tr: { englishName: 'Turkish', nativeName: 'Türkçe' },
    uk: { englishName: 'Ukrainian', nativeName: 'Українська' },
    vi: { englishName: 'Vietnamese', nativeName: 'Tiếng Việt' },
    'zh-CN': { englishName: 'Chinese, China', nativeName: '中文' },
    'zh-TW': { englishName: 'Chinese, Taiwan', nativeName: '繁體中文' }
};

/**
 * Finds the first locale that matches the input string.
 *
 * @param input The input string to match against locale codes or names.
 * @param enabled Whether to restrict search to only enabled locales.
 * @returns The first matching Locale found, or undefined if none found.
 */
export function findLocale(input: string, enabled: boolean): Locale {
    return findMultipleLocales(input, enabled, 1)[0];
}

/**
 * Finds multiple locales matching the input string.
 *
 * Matching is done against locale codes, native names, and English names,
 * first by exact match, then by startsWith, then includes.
 *
 * @param input The input string to search for.
 * @param enabled Whether to restrict search to only enabled locales.
 * @param limit Maximum number of results to return (default: unlimited).
 * @returns An array of Locale values matching the search criteria.
 */
export function findMultipleLocales(
    input: string,
    enabled: boolean,
    limit = Number.MAX_VALUE
): Locale[] {
    const languageCodes = enabled ? EnabledLocales : Object.values(Locale).sort();
    const search = input.toLowerCase();
    const found = new Set<Locale>();

    // Exact match checks
    if (found.size < limit) {
        languageCodes
            .filter(langCode => langCode.toLowerCase() === search)
            .forEach(langCode => found.add(langCode));
    }
    if (found.size < limit) {
        languageCodes
            .filter(langCode => Language[langCode].nativeName.toLowerCase() === search)
            .forEach(langCode => found.add(langCode));
    }
    if (found.size < limit) {
        languageCodes
            .filter(langCode => Language[langCode].englishName.toLowerCase() === search)
            .forEach(langCode => found.add(langCode));
    }

    // Starts with checks
    if (found.size < limit) {
        languageCodes
            .filter(langCode => langCode.toLowerCase().startsWith(search))
            .forEach(langCode => found.add(langCode));
    }
    if (found.size < limit) {
        languageCodes
            .filter(langCode => Language[langCode].nativeName.toLowerCase().startsWith(search))
            .forEach(langCode => found.add(langCode));
    }
    if (found.size < limit) {
        languageCodes
            .filter(langCode => Language[langCode].englishName.toLowerCase().startsWith(search))
            .forEach(langCode => found.add(langCode));
    }

    // Includes checks
    if (found.size < limit) {
        languageCodes
            .filter(langCode => langCode.toLowerCase().includes(search))
            .forEach(langCode => found.add(langCode));
    }
    if (found.size < limit) {
        languageCodes
            .filter(langCode => Language[langCode].nativeName.toLowerCase().includes(search))
            .forEach(langCode => found.add(langCode));
    }
    if (found.size < limit) {
        languageCodes
            .filter(langCode => Language[langCode].englishName.toLowerCase().includes(search))
            .forEach(langCode => found.add(langCode));
    }

    return [...found];
}
