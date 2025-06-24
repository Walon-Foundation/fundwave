"use client"

import { useState } from "react"
import { Globe, Check } from "lucide-react"

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  supported: boolean
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", supported: true },
  { code: "kri", name: "Krio", nativeName: "Krio", flag: "🇸🇱", supported: true },
  { code: "men", name: "Mende", nativeName: "Mɛnde yia", flag: "🇸🇱", supported: true },
  { code: "tem", name: "Temne", nativeName: "Themne", flag: "🇸🇱", supported: true },
  { code: "lim", name: "Limba", nativeName: "Limba", flag: "🇸🇱", supported: false },
  { code: "ful", name: "Fula", nativeName: "Fulfulde", flag: "🇸🇱", supported: false },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", supported: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", supported: false },
]

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (languageCode: string) => void
  compact?: boolean
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  compact = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find((lang) => lang.code === currentLanguage) || languages[0]

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode)
    setIsOpen(false)
  }

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLang.nativeName}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-slate-500 px-3 py-2">Select Language</div>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => language.supported && handleLanguageSelect(language.code)}
                  disabled={!language.supported}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    language.supported ? "hover:bg-slate-100 text-slate-900" : "text-slate-400 cursor-not-allowed"
                  } ${currentLanguage === language.code ? "bg-indigo-50 text-indigo-600" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-slate-500">{language.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!language.supported && (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Soon</span>
                    )}
                    {currentLanguage === language.code && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="w-6 h-6 text-indigo-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Language / Langwej / Yia</h3>
          <p className="text-sm text-slate-600">Choose your preferred language</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => language.supported && handleLanguageSelect(language.code)}
            disabled={!language.supported}
            className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
              language.supported
                ? "hover:border-indigo-300 hover:bg-indigo-50"
                : "border-slate-100 bg-slate-50 cursor-not-allowed"
            } ${
              currentLanguage === language.code
                ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{language.flag}</span>
              <div className="text-left">
                <div className={`font-medium ${language.supported ? "text-slate-900" : "text-slate-400"}`}>
                  {language.nativeName}
                </div>
                <div className="text-sm text-slate-500">{language.name}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!language.supported && (
                <span className="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">Coming Soon</span>
              )}
              {currentLanguage === language.code && language.supported && <Check className="w-5 h-5 text-indigo-600" />}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Help Us Translate</h4>
        <p className="text-sm text-blue-700 mb-3">
          Want to help make FundWaveSL available in your language? Join our translation community!
        </p>
        <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Become a Translator
        </button>
      </div>
    </div>
  )
}
