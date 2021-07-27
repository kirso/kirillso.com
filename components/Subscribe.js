import { useState, useRef } from 'react'
import useSWR from 'swr'
import fetcher from '@/lib/fetcher'
import SuccessMessage from '@/components/SuccessMessage'
import ErrorMessage from '@/components/ErrorMessage'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Subscribe() {
  const [form, setForm] = useState(false)
  const inputEl = useRef(null)
  const { data } = useSWR('/api/subscribers', fetcher)
  const subscriberCount = new Number(data?.count)

  const subscribe = async (e) => {
    e.preventDefault()
    setForm({ state: 'loading' })

    const res = await fetch('/api/subscribe', {
      body: JSON.stringify({
        email: inputEl.current.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()
    if (error) {
      setForm({
        state: 'error',
        message: error,
      })
      return
    }

    inputEl.current.value = ''
    setForm({
      state: 'success',
      message: `Yay! Thanks for subscribing.`,
    })
  }

  return (
    <div className="p-5">
      <div className="prose dark:prose-dark border border-primary-200 rounded-lg p-5 w-full dark:border-gray-400 bg-primary-100 dark:bg-primary-900">
        <h3 className="text-center">Subscribe to MetaView</h3>
        <p>An irregular digest that helps you become smarter and better human being.</p>

        <form className="relative my-4" onSubmit={subscribe}>
          <input
            ref={inputEl}
            aria-label="Newsletter email subscription"
            placeholder="you.are@areawesome.com"
            type="email"
            autoComplete="email"
            required
            className="px-4 py-2 mt-1 text-lg border-none focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md "
          />
          <button
            className="flex items-center justify-center absolute right-2 top-1 px-6 font-bold h-9 bg-primary-500 hover:bg-primary-600 dark:hover-blue-400 text-gray-100 dark:text-gray-100 rounded-md w-28"
            type="submit"
          >
            {form.state === 'loading' ? <LoadingSpinner /> : 'Subscribe'}
          </button>
        </form>
        {form.state === 'error' ? (
          <ErrorMessage>{form.message}</ErrorMessage>
        ) : form.state === 'success' ? (
          <SuccessMessage>{form.message}</SuccessMessage>
        ) : (
          <p className="text-lg text-center font-sans text-gray-600 dark:text-gray-300">
            {`${subscriberCount > 0 ? subscriberCount.toLocaleString() : '-'} subscribers`}
            {/* <Link href="/newsletter">
              <a>30 issues</a>
            </Link> */}
          </p>
        )}
      </div>
    </div>
  )
}
