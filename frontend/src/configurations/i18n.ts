import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../lang/en.json'
import pt from '../lang/pt.json'

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        pt: { translation: pt },
    },
    lng: 'en',
})
