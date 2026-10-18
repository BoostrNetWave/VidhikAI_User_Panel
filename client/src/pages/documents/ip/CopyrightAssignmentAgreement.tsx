import DocumentBaseGenerator from '../DocumentBaseGenerator';
import { CopyrightAssignmentForm } from './CopyrightAssignmentForm';

export default function CopyrightAssignmentAgreement() {
    const today = new Date().toISOString().split('T')[0];

    const initialFormData = {
        assignorName: 'Rajesh Kumar',
        assignorAddress: 'Flat 101, Sunshine Apartments, Indiranagar, Bangalore, Karnataka 560038',
        assignorType: 'Individual',
        assignorID: 'ABCDE1234F',
        assigneeName: 'NexGen Robotics Technologies Pvt Ltd',
        assigneeAddress: 'No. 42, 4th Floor, Dynasty Business Park, Andheri-Kurla Road, Mumbai, Maharashtra 400059',
        assigneeType: 'Company',
        assigneeID: 'U72900KA2023PTC198273',
        workTitle: 'Autonomous Drone Navigation Software (v2.1)',
        workDescription: 'Source code for the collision avoidance and path planning algorithms used in the NexGen Alpha Drone series.',
        workType: 'Software/Code',
        creationDate: 'February 2024',
        effectiveDate: today,
        considerationAmount: 'INR 5,00,000 (Five Lakhs Only)',
        territory: 'Worldwide',
        duration: 'Perpetual',
        rightsAssigned: 'All exclusive rights including reproduction, distribution, public performance, and derivative works',
        governingLaw: 'India',
        jurisdiction: 'Mumbai, India'
    };

    const sidebarTips = [
        { title: "Identify the Work", content: "Be as specific as possible when describing the work being assigned. Use titles, version numbers, or unique identifiers." },
        { title: "Section 19 Compliance", content: "Under the Indian Copyright Act, an assignment is valid only if it is in writing and signed by the assignor or their authorized agent." },
        { title: "Moral Rights", content: "Even after assignment, authors retain 'moral rights'. A waiver clause is included to ensure the assignee has full commercial freedom." },
        { title: "Territory and Duration", content: "If the territory is not specified, it is presumed to be India. If duration is not specified, it is presumed to be 5 years. This agreement defaults to Worldwide and Perpetual." }
    ];

    return (
        <DocumentBaseGenerator
            title="Copyright Assignment"
            description="Transfer total and absolute ownership of creative works, code, or intellectual property."
            documentType="copyright-assignment"
            initialFormData={initialFormData}
            docxFilename="copyright-assignment.docx"
            sidebarDescription="Generate legally binding copyright transfer agreements to secure intellectual property ownership for your company."
            sidebarTips={sidebarTips}
            renderForm={(formData, handleInputChange, handleSelectChange, setFormData) => (
                <CopyrightAssignmentForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    setFormData={setFormData}
                />
            )}
        />
    );
}
