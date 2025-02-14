"use client"

import { useState } from 'react';
import Image from 'next/image';
import soladdress from "@/assets/soladdress.jpg"

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Complete Your Donation</h2>
              <p className="text-gray-500">Securely process your payment to support this campaign</p>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">Donation Summary</h3>
                <div className="flex justify-between text-gray-600">
                  <span>Campaign:</span>
                  <span className="font-medium">Clean Water for Rural Schools</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Amount:</span>
                  <span className="font-medium">NLe50</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="mr-2"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="mr-2"
                      value="mobile"
                      checked={paymentMethod === 'mobile'}
                      onChange={() => setPaymentMethod('mobile')}
                    />
                    <span>Mobile Money</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="mr-2"
                      value="solana"
                      checked={paymentMethod === 'solana'}
                      onChange={() => setPaymentMethod('solana')}
                    />
                    <span>Solana</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                      <input
                        id="cardNumber"
                        className="mt-1 block w-full rounded-md py-2 px-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on Card</label>
                      <input
                        id="cardName"
                        className="mt-1 block w-full rounded-md py-2 px-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        id="expiry"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 px-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="MM / YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                      <input
                        id="cvv"
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'mobile' && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input
                      id="mobileNumber"
                      className="mt-1 block w-full rounded-md py-2 px-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label htmlFor="mobileProvider" className="block text-sm font-medium text-gray-700">Mobile Money Provider</label>
                    <select
                      id="mobileProvider"
                      className="mt-1 block w-full rounded-md py-2 px-2 border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="mpesa">Orange Money</option>
                      <option value="airtel">Afri-Money</option>
                      <option value="mtn">Q-Money</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'solana' && (
                <div className="space-y-4">
                  <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-center">
                    <Image
                      src={soladdress}
                      alt="Solana QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                  <p className="text-sm text-center text-gray-500">
                    Scan this QR code with your Solana wallet app to make the payment.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Securely Pay NLe50
              </button>
              <p className="text-xs text-center text-gray-500 mt-4">
                Your payment is secured by industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
