export const listWarantyClaimService = {
    // Main function to return all events
    getListWarantyData() {
        return [
            {
                id: 1,
                refNo: 'CLM-2025-001',
                claimDate: '2025-09-01',
                submitDate: '2025-09-02',
                dealerName: 'AutoWorld KL',
                warrantyType: 'New', 
                claimType: 'Tire Defect',
                status: 0, // Pending
                summary: {
                    ctcNo: 'CTC-2025-001',
                    scrapNo: 'SCR-8765',
                    invoiceNo: 'INV-4567'
                },
                dealerInfo: {
                    dealerCode: 'DLR-001',
                    custAccountNo: '6080100900',
                    contactPerson: 'Ahmad Zaki',
                    contactNo: '+6012-3456789'
                },
                customerInfo: {
                    name: 'Lee Wei Ming',
                    vehicle: 'Toyota Hilux 2.8G',
                    regNo: 'WXY 4567'
                },
                tires: {
                    size: '265/65R17',
                    pattern: 'Open Country A/T',
                    serialNo: 'TYR-99887766',
                    treadDepths: [6.5, 6.7, 6.6, 6.4]
                },
                problem: {
                    issue: 'Sidewall crack within 6 months of purchase',
                    imageURL: ['/demo/images/sidewall-damage.jpg'],
                    damageCode: 'D-102 (Sidewall Separation)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-001', status: 'Pending Review' },
                scrapDetails: { scrapNo: 'SCR-8765', status: 'Pending Photo Upload' },
                claimVariable: {
                    amount: 'RM 450.00',
                    replacementType: 'Partial',
                    Claim: '50%',
                    Usable: '60%',
                    Worn: '40%'
                },
                replacementOrder: {
                    orderNo: 'ORD-5569',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-119', status: 'Return' },
                report: { file: 'CLM-2025-001-Report.pdf' }
            },
            {
                id: 2,
                refNo: 'CLM-2025-002',
                claimDate: '2025-09-03',
                submitDate: '2025-09-04',
                dealerName: 'Speedy Motors',
                warrantyType: 'Pending CTC', // 
                claimType: 'Manufacturing',
                status: 1, // ETEN Approved
                summary: {
                    ctcNo: 'CTC-2025-002',
                    scrapNo: 'SCR-1122',
                    invoiceNo: 'INV-4588'
                },
                dealerInfo: {
                    dealerCode: 'DLR-002',
                    custAccountNo: '6080102300',
                    contactPerson: 'Siti Noraini',
                    contactNo: '+6017-9988776'
                },
                customerInfo: {
                    name: 'Raj Kumar',
                    vehicle: 'Toyota Vios 1.5G',
                    regNo: 'VBD 3321'
                },
                tires: {
                    size: '195/55R15',
                    pattern: 'Proxes R45',
                    serialNo: 'TYR-22334455',
                    treadDepths: [7.0, 7.1, 7.0, 7.2]
                },
                problem: {
                    issue: 'Uneven tread wear within 3 months',
                    photos: ['https://example.com/images/tread_wear.jpg'],
                    damageCode: 'D-210 (Tread Separation)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-002', status: 'Reviewed' },
                scrapDetails: { scrapNo: 'SCR-1122', status: 'Received' },
                claimVariable: {
                    amount: 'RM 600.00',
                    replacementType: 'Full',
                    Claim: '90%',
                    Usable: '40%',
                    Worn: '40%'
                },
                replacementOrder: {
                    orderNo: 'ORD-5570',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-120', status: 'Not Return' },
                report: { file: 'CLM-2025-002-Report.pdf' }
            },
            {
                id: 3,
                refNo: 'CLM-2025-003',
                claimDate: '2025-09-04',
                submitDate: '2025-09-05',
                dealerName: 'MegaTire Johor',
                warrantyType: 'Pending Scrap', // 
                claimType: 'Warranty Ext.',
                status: 2, // ETEN Rejected
                summary: {
                    ctcNo: 'CTC-2025-003',
                    scrapNo: 'SCR-3344',
                    invoiceNo: 'INV-4601'
                },
                dealerInfo: {
                    dealerCode: 'DLR-003',
                    custAccountNo: '6080102301',
                    contactPerson: 'Tan Chee Hock',
                    contactNo: '+6019-5566778'
                },
                customerInfo: {
                    name: 'Aminah Binti Yusof',
                    vehicle: 'Perodua Myvi 1.3',
                    regNo: 'JDK 7788'
                },
                tires: {
                    size: '175/65R14',
                    pattern: 'NanoEnergy 3',
                    serialNo: 'TYR-44556677',
                    treadDepths: [6.8, 6.9, 6.7, 6.9]
                },
                problem: {
                    issue: 'Customer reported vibration noise',
                    photos: ['https://example.com/images/vibration_issue.jpg'],
                    damageCode: 'D-305 (Noise/Vibration)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-003', status: 'Rejected' },
                scrapDetails: { scrapNo: 'SCR-3344', status: 'Not Required' },
                claimVariable: {
                    amount: 'RM 280.00',
                    replacementType: 'Partial',
                    Claim: '70%',
                    Usable: '50%',
                    Worn: '50%'
                },
                replacementOrder: {
                    orderNo: 'ORD-5570',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-120', status: 'Not Return' },
                report: { file: 'CLM-2025-003-Report.pdf' }
            },
            {
                id: 4,
                refNo: 'CLM-2025-004',
                claimDate: '2025-09-05',
                submitDate: '2025-09-06',
                dealerName: 'CityTire Penang',
                warrantyType: 'Pending Invoice', // 
                claimType: 'Damage Claim',
                status: 3, // Processing
                summary: {
                    ctcNo: 'CTC-2025-004',
                    scrapNo: 'SCR-5566',
                    invoiceNo: 'INV-4620'
                },
                dealerInfo: {
                    dealerCode: 'DLR-004',
                    custAccountNo: '6080102302',
                    contactPerson: 'Lim Wei Han',
                    contactNo: '+6011-2233445'
                },
                customerInfo: {
                    name: 'Chan Kok Leong',
                    vehicle: 'Honda Civic 1.8S',
                    regNo: 'PNA 6621'
                },
                tires: {
                    size: '225/45R17',
                    pattern: 'Proxes T1 Sport',
                    serialNo: 'TYR-77889900',
                    treadDepths: [7.5, 7.5, 7.4, 7.6]
                },
                problem: {
                    issue: 'Puncture not repairable (manufacturing fault claimed)',
                    photos: ['https://example.com/images/puncture_fault.jpg'],
                    damageCode: 'D-405 (Impact Damage)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-004', status: 'In Review' },
                scrapDetails: { scrapNo: 'SCR-5566', status: 'Pending Inspection' },
                claimVariable: {
                    amount: 'RM 500.00',
                    replacementType: 'Partial',
                    Claim: '60%',
                    Usable: '70%',
                    Worn: '30%'
                },
                replacementOrder: {
                    orderNo: 'ORD-5570',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-120', status: 'Not Return' },
                report: { file: 'CLM-2025-004-Report.pdf' }
            },
            {
                id: 5,
                refNo: 'CLM-2025-005',
                claimDate: '2025-09-07',
                submitDate: '2025-09-08',
                dealerName: 'WheelHub Ipoh',
                warrantyType: 'Waiting Approval', 
                claimType: 'Tire Defect',
                status: 4, 
                summary: {
                    ctcNo: 'CTC-2025-005',
                    scrapNo: 'SCR-6677',
                    invoiceNo: 'INV-4633'
                },
                dealerInfo: {
                    dealerCode: 'DLR-005',
                    custAccountNo: '6080114400',
                    contactPerson: 'Mohd Hafiz',
                    contactNo: '+6013-8899776'
                },
                customerInfo: {
                    name: 'Suresh Kumar',
                    vehicle: 'Mazda CX-5',
                    regNo: 'ABC 9988'
                },
                tires: {
                    size: '225/55R19',
                    pattern: 'Open Country U/T',
                    serialNo: 'TYR-99112233',
                    treadDepths: [7.1, 7.2, 7.1, 7.0]
                },
                problem: {
                    issue: 'Bulge developed on sidewall',
                    photos: ['https://example.com/images/sidewall_bulge.jpg'],
                    damageCode: 'D-220 (Sidewall Bulge)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-005', status: 'Approved' },
                scrapDetails: { scrapNo: 'SCR-6677', status: 'Scrapped' },
                claimVariable: {
                    amount: 'RM 900.00',
                    replacementType: 'Full',
                    Claim: '100%',
                    Usable: '30%',
                    Worn: '70%'
                },
                replacementOrder: {
                    orderNo: 'ORD-5570',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-120', status: 'Not Return' },
                report: { file: 'CLM-2025-005-Report.pdf' }
            },
            {
                id: 6,
                refNo: 'CLM-2025-006',
                claimDate: '2025-09-08',
                submitDate: '2025-09-09',
                dealerName: 'MegaTire JB',
                warrantyType: 'Processing',  
                claimType: 'Manufacturing',
                status: 5, // Pending
                summary: {
                    ctcNo: 'CTC-2025-006',
                    scrapNo: 'SCR-7788',
                    invoiceNo: 'INV-4644'
                },
                dealerInfo: {
                    dealerCode: 'DLR-006',
                    custAccountNo: '6080125300',
                    contactPerson: 'Farid Ismail',
                    contactNo: '+6010-2233445'
                },
                customerInfo: {
                    name: 'Nurul Aisyah',
                    vehicle: 'Toyota Camry 2.5V',
                    regNo: 'JBN 2210'
                },
                tires: {
                    size: '215/55R17',
                    pattern: 'Celsius',
                    serialNo: 'TYR-55667788',
                    treadDepths: [7.3, 7.2, 7.4, 7.3]
                },
                problem: {
                    issue: 'Cracks along tread grooves',
                    photos: ['https://example.com/images/tread_cracks.jpg'],
                    damageCode: 'D-130 (Groove Cracking)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-006', status: 'Pending Review' },
                scrapDetails: { scrapNo: 'SCR-7788', status: 'Pending Scrap' },
                claimVariable: {
                    amount: 'RM 720.00',
                    replacementType: 'Full',
                    Claim: '80%',
                    Usable: '50%',
                    Worn: '50%'
                },
                replacementOrder: {
                    orderNo: 'ORD-5570',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-120', status: 'Not Return' },
                report: { file: 'CLM-2025-006-Report.pdf' }
            },
            {
                id: 7,
                refNo: 'CLM-2025-007',
                claimDate: '2025-09-09',
                submitDate: '2025-09-10',
                dealerName: 'TireZone Melaka',
                warrantyType: 'Completed', 
                claimType: 'Damage Claim',
                status: 6, // Toyo Rejected
                summary: {
                    ctcNo: 'CTC-2025-007',
                    scrapNo: 'SCR-8899',
                    invoiceNo: 'INV-4655'
                },
                dealerInfo: {
                    dealerCode: 'DLR-007',
                    custAccountNo: '6080126701',
                    contactPerson: 'Koh Mei Lin',
                    contactNo: '+6018-7788990'
                },
                customerInfo: {
                    name: 'Ganesh Pillai',
                    vehicle: 'Proton X70',
                    regNo: 'MCU 4455'
                },
                tires: {
                    size: '225/60R18',
                    pattern: 'Proxes CR1',
                    serialNo: 'TYR-66778899',
                    treadDepths: [7.0, 7.0, 6.9, 7.1]
                },
                problem: {
                    issue: 'Curb damage not covered under warranty',
                    photos: ['https://example.com/images/curb_damage.jpg'],
                    damageCode: 'D-499 (External Damage)'
                },
                ctcDetails: { ctcNo: 'CTC-2025-007', status: 'Rejected' },
                scrapDetails: { scrapNo: 'SCR-8899', status: 'Not Accepted' },
                claimVariable: {
                    amount: 'RM 850.00',
                    replacementType: 'Full',
                    Claim: '85%',
                    Usable: '20%',
                    Worn: '80%' 
                },
                replacementOrder: {
                    orderNo: 'ORD-5570',
                    name: 'Proxes',
                    item: 'Proxes R45',
                    quantity: '4',
                    total: '500.00',
                    subTotal: '2000.00'
                },
                reimbursement: { refNo: 'TBD-1109', orderNo: 'TY-120', status: 'Not Return' },
                report: { file: 'CLM-2025-007-Report.pdf' }
            }
        ];
    },

    // Return first 5 events
    getListWarantyMini() {
        return Promise.resolve(this.getListWarantyData().slice(0, 5));
    },

    // Return first 10 events
    getListWarantySmall() {
        return Promise.resolve(this.getListWarantyData().slice(0, 10));
    },

    // Return all events
    getListWaranty() {
        return Promise.resolve(this.getListWarantyData());
    }
};
