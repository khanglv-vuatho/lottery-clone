import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { redirect } from 'next/navigation'
import { NextIntlClientProvider, useLocale } from 'next-intl'
import { locales } from '@/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lottey Game',
  description: 'Lottey Game',
}

const timeZone = 'Asia/Ho_Chi_Minh'

export default async function RootLayout({ children, params }: any) {
  const { locale } = params
  console.log(params)

  const isValidLocale = locales.some((cur) => cur === locale)
  console.log(isValidLocale)

  if (!isValidLocale) {
    console.log(params)

    return redirect(`/vi/${locale}`)
  }

  let messages

  try {
    messages = (await import(`../../../messages/${locale || 'vi'}.json`)).default
  } catch (error) {
    console.log(error)
  }
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
