import { DefaultLocale, EnabledLocales } from '../models/enum-helpers';
import {
    EmbedAuthorData,
    EmbedBuilder,
    HexColorString,
    Locale,
    LocalizationMap,
    resolveColor
} from 'discord.js';
import { Linguini, TypeMapper, TypeMappers, Utils } from 'linguini';
import path from 'node:path';

const linguini = new Linguini(path.resolve(__dirname, '../../lang'), 'lang');

/**
 * Interface representing the structure of an embed defined in a JSON language file.
 */
interface JsonEmbedData {
    author?: EmbedAuthorData;
    title?: string | string[];
    url?: string;
    thumbnail?: string;
    description?: string | string[];
    fields?: {
        name: string | string[];
        value: string | string[];
        inline?: boolean;
    }[];
    image?: string;
    footer?: {
        text?: string | string[];
        icon?: string;
    };
    timestamp?: boolean;
    color?: number | string;
}

/**
 * Retrieves a localized EmbedBuilder object from the translation files using the given location and language.
 *
 * Falls back to the default language if the specified one is unavailable.
 *
 * @param location The key location in the translation file.
 * @param languageCode The locale/language to use for translation.
 * @param variables Optional key-value replacements for dynamic translation strings.
 * @returns A populated EmbedBuilder instance.
 */
export function getEmbed(
    location: string,
    languageCode: Locale,
    variables?: Record<string, string>
): EmbedBuilder {
    return (
        linguini.get(location, languageCode, embedTm, variables) ??
        linguini.get(location, DefaultLocale, embedTm, variables)
    );
}

/**
 * Retrieves a localized regular expression from the translation files.
 *
 * Falls back to the default language if the specified one is unavailable.
 *
 * @param location The key location in the translation file.
 * @param languageCode The locale/language to use.
 * @returns A regular expression built from the localized string.
 */
export function getRegex(location: string, languageCode: Locale): RegExp {
    return (
        linguini.get(location, languageCode, TypeMappers.RegExp) ??
        linguini.get(location, DefaultLocale, TypeMappers.RegExp)
    );
}

/**
 * Retrieves a localized reference string from the translation files.
 *
 * Falls back to the default language if the specified one is unavailable.
 *
 * @param location The key location in the translation file.
 * @param languageCode The locale/language to use.
 * @param variables Optional replacements for dynamic placeholders.
 * @returns A resolved localized string.
 */
export function getRef(
    location: string,
    languageCode: Locale,
    variables?: Record<string, string>
): string {
    return (
        linguini.getRef(location, languageCode, variables) ??
        linguini.getRef(location, DefaultLocale, variables)
    );
}

/**
 * Generates a localization map containing strings for all enabled languages.
 *
 * @param location The key location in the translation file.
 * @param variables Optional replacements for dynamic placeholders.
 * @returns A LocalizationMap object for all supported languages.
 */
export function getRefLocalizationMap(
    location: string,
    variables?: Record<string, string>
): LocalizationMap {
    const object: LocalizationMap = {};
    for (const languageCode of EnabledLocales) {
        object[languageCode] = getRef(location, languageCode, variables);
    }
    return object;
}

/**
 * Retrieves a common/shared string from the translation file.
 *
 * @param location The key location in the common file.
 * @param variables Optional replacements for dynamic placeholders.
 * @returns The resolved string from the common file.
 */
export function getCom(location: string, variables?: Record<string, string>): string {
    return linguini.getCom(location, variables);
}

/**
 * A type mapper function that converts a `JsonEmbedData` object
 * into a fully structured `EmbedBuilder` instance.
 *
 * Handles string array joins, image URLs, default colors, and field structure.
 */
export const embedTm: TypeMapper<EmbedBuilder> = (jsonValue: JsonEmbedData) => {
    return new EmbedBuilder({
        author: jsonValue.author,
        title: jsonValue.title !== undefined ? Utils.join(jsonValue.title, '\n') : undefined,
        url: jsonValue.url,
        thumbnail: jsonValue.thumbnail !== undefined ? { url: jsonValue.thumbnail } : undefined,
        description:
            jsonValue.description !== undefined
                ? Utils.join(jsonValue.description, '\n')
                : undefined,
        fields: jsonValue.fields?.map(field => ({
            name: Utils.join(field.name, '\n'),
            value: Utils.join(field.value, '\n'),
            inline: field.inline ? field.inline : false
        })),
        image: jsonValue.image ? { url: jsonValue.image } : undefined,
        footer:
            jsonValue.footer !== undefined && jsonValue.footer.text
                ? {
                      text: Utils.join(jsonValue.footer.text, '\n'),
                      iconURL: jsonValue.footer.icon
                  }
                : undefined,
        timestamp: jsonValue.timestamp !== undefined ? new Date().toISOString() : undefined,
        color: resolveColor(
            typeof jsonValue.color === 'number'
                ? jsonValue.color
                : ((jsonValue.color as HexColorString) ?? getCom('colors.default'))
        )
    });
};
