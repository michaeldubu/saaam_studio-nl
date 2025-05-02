import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Star, Zap, Award, Shield } from 'lucide-react';

const SubscriptionPaywall = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('yearly');
  const [showFaqItem, setShowFaqItem] = useState(null);

  const toggleFaqItem = (index) => {
    setShowFaqItem(showFaqItem === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="px-4 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-yellow-400">SAAAM Studio</h1>
          <button className="px-2 py-1 text-sm text-gray-300 border border-gray-600 rounded">
            Skip for now
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-md mx-auto">
          {/* Hero section */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Unleash Your Game Development Potential</h2>
            <p className="text-gray-300">
              Choose the plan that fits your needs and take your game creation to the next level.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex justify-center items-center mb-6">
            <button
              className={`px-4 py-2 rounded-l-lg ${
                billingCycle === 'monthly' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-700'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly <span className="text-xs text-green-400">Save 30%</span>
            </button>
          </div>

          {/* Subscription plans */}
          <div className="space-y-4 mb-8">
            {/* Free plan */}
            <div 
              className={`p-4 rounded-lg border ${
                selectedPlan === 'free' 
                  ? 'border-blue-500 bg-gray-800' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
              onClick={() => setSelectedPlan('free')}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">Free</h3>
                  <p className="text-gray-400 text-sm">Basic access to core features</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">$0</div>
                  <div className="text-xs text-gray-400">Forever</div>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Up to 3 projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Basic game editor</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Core asset library</span>
                </li>
              </ul>
            </div>

            {/* Indie plan */}
            <div 
              className={`p-4 rounded-lg border ${
                selectedPlan === 'indie' 
                  ? 'border-blue-500 bg-gray-800' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
              onClick={() => setSelectedPlan('indie')}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">Indie</h3>
                  <p className="text-gray-400 text-sm">Perfect for hobbyists and learners</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {billingCycle === 'monthly' ? '$5.99' : '$49.99'}
                  </div>
                  <div className="text-xs text-gray-400">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Up to 20 projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Full code editor</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Premium asset packs</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Export without branding</span>
                </li>
              </ul>
            </div>

            {/* Pro plan */}
            <div 
              className={`p-4 rounded-lg border ${
                selectedPlan === 'pro' 
                  ? 'border-blue-500 bg-gray-800' 
                  : 'border-gray-700 bg-gray-800/50'
              }`}
              onClick={() => setSelectedPlan('pro')}
            >
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-xs text-black font-bold py-1 px-3 rounded-full">
                  BEST VALUE
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">Pro</h3>
                  <p className="text-gray-400 text-sm">For serious game developers</p>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {billingCycle === 'monthly' ? '$12.99' : '$99.99'}
                  </div>
                  <div className="text-xs text-gray-400">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>
              </div>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Unlimited projects</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Cloud backup & sync</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">All asset packs included</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Advanced debugging tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-sm">Direct publishing to app stores</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trial message */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-300">
              Start with a <span className="text-blue-400 font-bold">14-day free trial</span>.
              Cancel anytime. No commitments.
            </p>
          </div>

          {/* CTA button */}
          <button 
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg mb-6 shadow-lg hover:from-blue-700 hover:to-blue-800"
          >
            Start Free Trial
          </button>

          {/* FAQ section */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {[
                {
                  question: "What happens after my free trial?",
                  answer: "After your 14-day free trial, you'll be charged the subscription fee for the plan you've selected. You can cancel anytime before the trial ends to avoid being charged."
                },
                {
                  question: "Can I switch between plans?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, your new plan will take effect at the end of your current billing cycle."
                },
                {
                  question: "How do I cancel my subscription?",
                  answer: "You can cancel your subscription at any time through the app settings or your Google Play subscription management page. After canceling, you'll still have access to premium features until the end of your current billing period."
                },
                {
                  question: "What platforms can I export my games to?",
                  answer: "With the Pro plan, you can export your games directly to Android, iOS, and web platforms. The Indie plan allows export to Android and web platforms. All plans allow you to export your game code for use in other environments."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                    onClick={() => toggleFaqItem(index)}
                  >
                    <span>{faq.question}</span>
                    {showFaqItem === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {showFaqItem === index && (
                    <div className="p-4 pt-0 text-sm text-gray-300 border-t border-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>By subscribing, you agree to our</p>
            <div className="flex justify-center space-x-2">
              <a href="#" className="text-blue-400">Terms of Service</a>
              <span>and</span>
              <a href="#" className="text-blue-400">Privacy Policy</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 px-4 py-3 border-t border-gray-700">
        <div className="flex justify-center space-x-4">
          <button className="text-sm text-gray-300">Contact Support</button>
          <button className="text-sm text-gray-300">Restore Purchase</button>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPaywall;