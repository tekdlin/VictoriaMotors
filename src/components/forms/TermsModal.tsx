'use client';

import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@/components/ui';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <ModalHeader onClose={onClose}>Terms and Conditions</ModalHeader>
      
      <ModalBody className="max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none text-victoria-slate-700">
          <p className="font-medium">Last Updated: January 2025</p>
          
          <h4 className="text-victoria-navy-900 font-display mt-6">1. Agreement to Terms</h4>
          <p>
            By creating an account with Victoria Motors, you agree to be bound by these Terms and Conditions. 
            If you do not agree to these terms, please do not create an account or use our services.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">2. Account Registration</h4>
          <p>
            To use our services, you must register for an account and provide accurate, complete information.
            You are responsible for maintaining the confidentiality of your account credentials and for all
            activities that occur under your account.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">3. Security Deposit</h4>
          <p>
            Upon registration, you will be required to pay a security deposit equal to 10% of your intended
            vehicle purchase value. This deposit is fully refundable upon completion of your agreement,
            subject to any outstanding balances or fees.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">4. Subscription Services</h4>
          <p>
            Our services are provided on a subscription basis. You may choose between monthly or fiscal
            subscription plans. Subscriptions will automatically renew unless cancelled before the renewal date.
          </p>
          <p>
            If your subscription payment fails and becomes past due, your account will be closed immediately
            and portal access will be revoked until the balance is resolved.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">5. Document Requirements</h4>
          <p>
            You agree to provide valid identification documents as required for account verification.
            For individual accounts, this includes a valid driver's license (front and back).
            For business accounts, this includes business registration documents.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">6. Payment Terms</h4>
          <p>
            All payments are processed through our secure payment provider, Stripe. By providing payment
            information, you authorize us to charge your payment method for all applicable fees, deposits,
            and subscription charges.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">7. Refund Policy</h4>
          <p>
            Security deposits are refundable upon account closure in good standing. Subscription fees
            are non-refundable for the current billing period. Refund requests are processed manually
            and may take 5-10 business days.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">8. Privacy</h4>
          <p>
            Your privacy is important to us. Please review our Privacy Policy for information on how
            we collect, use, and protect your personal data.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">9. Account Termination</h4>
          <p>
            We reserve the right to suspend or terminate your account for violations of these terms,
            fraudulent activity, or any other reason at our sole discretion. You may also request
            account closure at any time through your customer portal.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">10. Limitation of Liability</h4>
          <p>
            Victoria Motors shall not be liable for any indirect, incidental, special, consequential,
            or punitive damages arising from your use of our services.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">11. Changes to Terms</h4>
          <p>
            We may update these terms from time to time. We will notify you of any material changes
            via email or through your customer portal. Continued use of our services after such
            changes constitutes acceptance of the updated terms.
          </p>

          <h4 className="text-victoria-navy-900 font-display mt-6">12. Contact Information</h4>
          <p>
            For questions about these terms, please contact us at:
          </p>
          <ul>
            <li>Email: contact@victoriamotorsinc.com</li>
            {/* <li>Phone: (555) 123-4567</li> */}
            <li>Address: 123 Auto Drive, Dallas, TX 75201</li>
          </ul>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onAccept}>
          I Accept These Terms
        </Button>
      </ModalFooter>
    </Modal>
  );
}
