import 'i18next'
import en from '../lang/en.json'
import pt from '../lang/pt.json'

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'en'
        resources: {
            en: typeof en
            pt: typeof pt
        }
    }
}

type KeyPaths<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends string ? K : `${K & string}.${KeyPaths<T[K]> & string}`
      }[keyof T]
    : never

export type TranslationKey = KeyPaths<typeof en>
