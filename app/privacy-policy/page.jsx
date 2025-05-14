export default function PrivacyPolicyPage() {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p className="text-gray-700">
            We prioritize your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Personal Information</h2>
          <p className="text-gray-700">
            We collect personal information only when necessary to fulfill your requests. This information will be used solely for the purpose of generating logos and will not be sold or redistributed to third parties.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Cookies</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Store generated logos</li>
            <li>Maintain session continuity, eliminating the need for email registration</li>
          </ul>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Google Analytics</h2>
          <p className="text-gray-700 mb-2">
            We employ Google Analytics to analyze website usage and improve our services. Google Analytics collects anonymous data, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Visit frequency</li>
            <li>Page navigation</li>
            <li>Referral sites</li>
          </ul>
          <p className="text-gray-700 mt-2">
            This information is used exclusively to enhance our website and does not include personally identifiable data.
          </p>
        </section>
  
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data Protection</h2>
          <p className="text-gray-700">
            We ensure the security and confidentiality of your personal information. Google Analytics collects only IP addresses, not names or identifying details, and we do not combine this data with personally identifiable information.
          </p>
        </section>
  
        <section>
          <h2 className="text-2xl font-semibold mb-3">Cookie Usage</h2>
          <p className="text-gray-700">
            Google Analytics uses a permanent cookie to identify unique users, but this cookie is exclusive to Google and cannot be accessed by us or other parties.
          </p>
          <p className="text-gray-700 mt-2">
            By using our website, you consent to our privacy policy and the use of cookies and Google Analytics as described above.
          </p>
        </section>
      </div>
    );
  }
  