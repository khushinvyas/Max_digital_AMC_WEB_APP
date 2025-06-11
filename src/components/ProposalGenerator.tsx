
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from 'lucide-react';

interface Customer {
  id: string;
  companyName: string;
  ownerName: string;
  city: string;
  address: string;
  phoneNumber: string;
  amcStartDate: string;
  amcEndDate: string;
  amcType: 'A' | 'B' | 'C';
  amcAmount: number;
  productDescription: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  status: 'active' | 'proposed' | 'expired' | 'suspended' | 'cancelled';
}

interface ProposalGeneratorProps {
  customer: Customer;
  onBack: () => void;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ customer, onBack }) => {
  const getAMCTypeDetails = (type: 'A' | 'B' | 'C') => {
    switch (type) {
      case 'A':
        return {
          title: 'TYPE A (Premium Plan) - Weekly Service',
          services: [
            'CCTV camera system weekly testing camp recording, time and date, power supply, hard disk as well as camera system',
            'CCTV camera system backup when required',
            'Unlimited breakdown service calls in CCTV camera system',
            'Software upgrade online monitoring monitoring report in CCTV camera system',
            'Hard disk health as well as other information in CCTV camera system',
            '1st Priority service call attendance'
          ],
          frequency: 'Weekly Service Visits'
        };
      case 'B':
        return {
          title: 'TYPE B (Standard Plan) - Monthly Service',
          services: [
            'Camera system monthly testing camp recording time and date power supply hard disk as well as camera system',
            'CCTV camera system backup when required',
            'Unlimited breakdown service calls in CCTV camera system',
            'Software upgrade online monitoring monitoring report in CCTV camera system',
            'Hard disk health as well as other information in CCTV camera system',
            '2nd Priority service call attendance'
          ],
          frequency: 'Monthly Service Visits'
        };
      case 'C':
        return {
          title: 'TYPE C (Basic Plan) - On-Demand Service',
          services: [
            'CCTV camera system backup when required',
            'Unlimited breakdown service calls in CCTV camera system',
            'Software upgrade online support in CCTV camera system',
            'Hard disk health as well as other information in CCTV camera system',
            '3rd Priority service call attendance'
          ],
          frequency: 'On-Demand Service Only'
        };
    }
  };

  const typeDetails = getAMCTypeDetails(customer.amcType);
  const proposalNumber = `PROP-${Date.now()}`;
  const proposalDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // For now, we'll use the browser's print to PDF functionality
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
          <div className="space-x-3">
            <Button variant="outline" onClick={handlePrint}>
              <FileText className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Proposal Document */}
        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8">
            {/* Company Header */}
            <div className="text-center mb-8 border-b-2 pb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">MAX Digital & Services</h1>
              <p className="text-lg text-muted-foreground">CCTV Installation & Maintenance Services</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Email: info@maxdigitalservices.com | Phone: +91 9876543210</p>
                <p>Address: 123 Technology Street, Digital City, Tech State - 123456</p>
              </div>
            </div>

            {/* Proposal Header */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">AMC PROPOSAL</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Proposal No:</strong> {proposalNumber}</p>
                  <p><strong>Date:</strong> {proposalDate}</p>
                  <p><strong>Valid Until:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customer Details:</h3>
                <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
                  <p><strong>Company:</strong> {customer.companyName}</p>
                  <p><strong>Contact Person:</strong> {customer.ownerName}</p>
                  <p><strong>Address:</strong> {customer.address}</p>
                  <p><strong>City:</strong> {customer.city}</p>
                  <p><strong>Phone:</strong> {customer.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            {customer.productDescription && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">System Details:</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{customer.productDescription}</p>
                </div>
              </div>
            )}

            {/* AMC Plan Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Proposed AMC Plan</h3>
              <div className="border rounded-lg p-6">
                <h4 className="text-xl font-bold text-primary mb-3">{typeDetails.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{typeDetails.frequency}</p>
                
                <h5 className="font-semibold mb-3">Services Included:</h5>
                <ul className="space-y-2 text-sm">
                  {typeDetails.services.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contract Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contract Duration</h3>
                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                  <p><strong>Start Date:</strong> {new Date(customer.amcStartDate).toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {new Date(customer.amcEndDate).toLocaleDateString()}</p>
                  <p><strong>Duration:</strong> 12 Months</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Investment Details</h3>
                <div className="bg-primary/10 p-4 rounded-lg text-sm space-y-2">
                  <p><strong>Total AMC Amount:</strong></p>
                  <p className="text-2xl font-bold text-primary">₹{customer.amcAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">(Including all taxes)</p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
              <div className="text-sm space-y-2">
                <ol className="list-decimal list-inside space-y-1">
                  <li>Payment terms: 100% advance payment required before service commencement.</li>
                  <li>Service will be provided during business hours (9 AM to 6 PM).</li>
                  <li>Emergency breakdown services available 24/7 for Type A customers.</li>
                  <li>Customer must provide safe and easy access to the equipment.</li>
                  <li>Replacement parts, if required, will be charged separately.</li>
                  <li>This contract is non-transferable and valid for the specified duration only.</li>
                  <li>Any modifications to this agreement must be in writing and signed by both parties.</li>
                </ol>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
              <div className="bg-muted p-4 rounded-lg text-sm">
                <p><strong>Payment Mode:</strong> Bank Transfer / Cheque / Cash</p>
                <p><strong>Bank Details:</strong> MAX Digital Services, Account No: 1234567890, IFSC: BANK0001234</p>
                <p><strong>GST No:</strong> 29ABCDE1234F1Z5</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
              <div>
                <h4 className="font-semibold mb-8">Customer Acceptance</h4>
                <div className="space-y-4">
                  <div className="border-b border-gray-300 pb-1">
                    <p className="text-xs text-muted-foreground">Signature</p>
                  </div>
                  <div>
                    <p className="text-sm"><strong>Name:</strong> {customer.ownerName}</p>
                    <p className="text-sm"><strong>Date:</strong> _____________</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-8">Authorized Signatory</h4>
                <div className="space-y-4">
                  <div className="border-b border-gray-300 pb-1">
                    <p className="text-xs text-muted-foreground">Signature</p>
                  </div>
                  <div>
                    <p className="text-sm"><strong>Name:</strong> Authorized Person</p>
                    <p className="text-sm"><strong>Title:</strong> Director</p>
                    <p className="text-sm"><strong>MAX Digital & Services</strong></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-4 border-t text-xs text-muted-foreground">
              <p>Thank you for choosing MAX Digital & Services for your CCTV maintenance needs.</p>
              <p>For any queries, please contact us at info@maxdigitalservices.com or +91 9876543210</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProposalGenerator;
