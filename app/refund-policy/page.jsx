export default function RefundPolicyPage() {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Refund and Satisfaction Guarantee Policy</h1>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Refund Policy</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>No Refunds After Purchase:</strong> Once a logo is purchased and files are accessible,
              refunds are not available.
            </li>
            <li>
              <strong>Equal Treatment:</strong> We ensure fairness by not making exceptions to this policy.
            </li>
          </ul>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold mb-3">Satisfaction Guarantee</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Logo Replacement:</strong> If you're not satisfied with your purchased logo, you can
              create another logo on our website and request a replacement within 30 days.
            </li>
            <li>
              <strong>One-Time Replacement:</strong> This option is available only once per purchase.
            </li>
            <li>
              <strong>License Transfer:</strong> The acquired license will be automatically transferred to the second logo.
            </li>
            <li>
              <strong>Usage Restrictions:</strong> After replacement, the first logo can no longer be used.
            </li>
          </ul>
        </section>
      </div>
    );
  }
