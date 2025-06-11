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
          services: {
            gujarati: [
              'CCTV કેમેરા સિસ્ટમનું વીલાલી ટેસ્ટિંગ કેમ્પ રેકોર્ડિંગ, ટાઇમ અને તારીખ, પાવર સપ્લાય, હાર્ડ ડિસ્ક તેમજ કેમેરા સિસ્ટમ',
              'CCTV કેમેરા સિસ્ટમનું બેકઅપ જ્યારે જરૂરિયાત હોય ત્યારે',
              'CCTV કેમેરા સિસ્ટમમાં અનલિમિટેડ બેક ડાઉન સર્વિસ કૉલ',
              'CCTV કેમેરા સિસ્ટમમાં સોફ્ટવેર અપગ્રેડ ઑનનાઇન મોનાઇટિંગ મોનીટરિંગ રીપોર્ટ',
              'CCTV કેમેરા સિસ્ટમમાં હાર્ડિસ્ક હેલ્થ તેમજ અદર્શ ઇન્ફોર્મેશન',
              '1st Priority સર્વિસ કૉલ એટેન્ડન્સ'
            ],
            english: [
              'CCTV camera system weekly testing camp recording, time and date, power supply, hard disk as well as camera system',
              'CCTV camera system backup when required',
              'Unlimited back down service calls in CCTV camera system',
              'Software upgrade online monitoring monitoring report in CCTV camera system',
              'Hard disk health as well as other information in CCTV camera system',
              '1st Priority service call attendance'
            ]
          },
          frequency: 'Weekly Service Visits'
        };
      case 'B':
        return {
          title: 'TYPE B (Standard Plan) - Monthly Service',
          services: {
            gujarati: [
              'કેમેરા સિસ્ટમનું મંથલી ટેસ્ટિંગ કેમ્પ રેકોર્ડિંગ ટાઇમ અને તારીખ પાવર સપ્લાય હાર્ડ ડિસ્ક તેમજ કેમેરા સિસ્ટમ',
              'CCTV કેમેરા સિસ્ટમનું બેકઅપ જ્યારે જરૂરિયાત હોય ત્યારે',
              'CCTV કેમેરા સિસ્ટમમાં અનલિમિટેડ બેક ડાઉન સર્વિસ કૉલ',
              'CCTV કેમેરા સિસ્ટમમાં સોફ્ટવેર અપગ્રેડ ઑનનાઇન મોનાઇટિંગ મોનીટરિંગ રીપોર્ટ',
              'CCTV કેમેરા સિસ્ટમમાં હાર્ડિસ્ક હેલ્થ તેમજ અદર્શ ઇન્ફોર્મેશન',
              '2nd Priority સર્વિસ કૉલ એટેન્ડન્સ'
            ],
            english: [
              'Camera system monthly testing camp recording time and date power supply hard disk as well as camera system',
              'CCTV camera system backup when required',
              'Unlimited back down service calls in CCTV camera system',
              'Software upgrade online monitoring monitoring report in CCTV camera system',
              'Hard disk health as well as other information in CCTV camera system',
              '2nd Priority service call attendance'
            ]
          },
          frequency: 'Monthly Service Visits'
        };
      case 'C':
        return {
          title: 'TYPE C (Basic Plan) - On-Demand Service',
          services: {
            gujarati: [
              'CCTV કેમેરા સિસ્ટમનું બેક અપ જ્યારે જરૂરિયાત હોય ત્યારે',
              'CCTV કેમેરા સિસ્ટમમાં અનલિમિટેડ બેક ડાઉન સર્વિસ કૉલ',
              'CCTV કેમેરા સિસ્ટમમાં સોફ્ટવેર અપગ્રેડ ઑનનાઇન સપોર્ટ',
              'CCTV કેમેરા સિસ્ટમમાં હાર્ડિસ્ક હેલ્થ તેમજ અદર્શ ઇન્ફોર્મેશન',
              '3rd Priority સર્વિસ કૉલ એટેન્ડન્સ'
            ],
            english: [
              'CCTV camera system backup when required',
              'Unlimited back down service calls in CCTV camera system',
              'Software upgrade online support in CCTV camera system',
              'Hard disk health as well as other information in CCTV camera system',
              '3rd Priority service call attendance'
            ]
          },
          frequency: 'On-Demand Service Only'
        };
    }
  };

  const typeDetails = getAMCTypeDetails(customer.amcType);
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
                <p>Phone: 9825452543</p>
                <p>First Floor, Radheshyam Chambers, to, Pirchhalla St, near Gruhlakshmi Haluriya, Vora Bazar, Bhavnagar, Gujarat 364001</p>
              </div>
            </div>

            {/* Proposal Header */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">AMC PROPOSAL</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Date:</strong> {proposalDate}</p>
                  <p><strong>Valid Until:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
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
                <h3 className="text-lg font-semibold mb-3">Description of Products/Services:</h3>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2">Gujarati</h6>
                    <ul className="space-y-2 text-sm">
                      {typeDetails.services.gujarati.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-2">English</h6>
                    <ul className="space-y-2 text-sm">
                      {typeDetails.services.english.map((service, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="grid grid-cols-2 gap-6 mb-8">
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

            {/* Payment Terms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
              <div className="bg-muted p-4 rounded-lg text-sm">
                <p><strong>Payment Mode:</strong> Bank Transfer / Cheque / Cash</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-8">
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
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-4 border-t text-xs text-muted-foreground">
              <p>Thank you for choosing MAX Digital & Services for your CCTV maintenance needs.</p>
              <p>For any queries, please contact us at 9825452543</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style>{`
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
