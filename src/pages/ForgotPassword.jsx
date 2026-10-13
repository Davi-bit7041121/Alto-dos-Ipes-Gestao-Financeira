import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Reset password</h1>
          <p className="text-gray-500 mt-2">We'll send you a link to reset it</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-4">
          {sent ? (
            <p className="text-sm text-gray-600 text-center py-4">
              If an account exists for {email}, a reset link has been sent.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3 h-12 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-brand"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-brand text-white h-12 rounded-md text-sm font-medium hover:bg-brand-dark transition-colors">
                Send reset link
              </button>
            </form>
          )}
        </div>

        <Link to="/login" className="flex items-center gap-1 text-sm text-brand font-medium hover:underline mt-6 justify-center">
          <ArrowLeft className="w-4 h-4" /> Back to log in
        </Link>
      </div>
    </div>
  )
}
