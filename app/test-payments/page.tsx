"use client"

import { PaymentTest } from "@/components/payment-test"

export default function TestPaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment System Test</h1>
          <p className="text-gray-600 mt-2">
            Use this page to test and debug payment system issues
          </p>
        </div>
        
        <PaymentTest />
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Troubleshooting Tips:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Make sure you have a valid course ID from your database</li>
            <li>• Check that all required environment variables are set</li>
            <li>• Verify that MongoDB is running and accessible</li>
            <li>• Check the browser console and server logs for detailed error messages</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
