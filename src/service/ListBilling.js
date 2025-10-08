export const BillingService = {
    // Main function to return all billing records
    getBillingData() {
        return [
            {
                id: 1,
                docsDate: '2025-03-10',
                docsNo: '2000110190',
                docsType: 'Credit Note',
                referenceDocsNo: 'EPD0038756',
                company: 'TSM',
                dealerId: '6030301800',
                dealerName: 'JACH TYRE & SPORT RIM SERVICE',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: -125.4,
                deleted: null
            },
            {
                id: 2,
                docsDate: '2025-03-10',
                docsNo: '2000110303',
                docsType: 'Credit Note',
                referenceDocsNo: 'EPD0038869',
                company: 'TSM',
                dealerId: '6011099200',
                dealerName: 'SIN TIEN TYRES SERVICE CENTER',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: -83.25,
                deleted: null
            },
            {
                id: 3,
                docsDate: '2025-03-10',
                docsNo: '0930463372',
                docsType: 'Invoice',
                referenceDocsNo: '0920476635',
                company: 'TSM',
                dealerId: '6020602300',
                dealerName: 'TOP TYRE & CAR CARE',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 642.8,
                deleted: null
            },
            {
                id: 4,
                docsDate: '2025-03-10',
                docsNo: '0930463260',
                docsType: 'Invoice',
                referenceDocsNo: '0920476621',
                company: 'TSM',
                dealerId: '6011401500',
                dealerName: 'SIN TIEN SING SERVICE CENTER',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 438.9,
                deleted: null
            },
            {
                id: 5,
                docsDate: '2025-03-10',
                docsNo: '0930463368',
                docsType: 'Invoice',
                referenceDocsNo: '0920476750',
                company: 'TSM',
                dealerId: '6081600400',
                dealerName: 'SPEED-CARE BATTERY & TYRE SERVICES',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 512.4,
                deleted: null
            },
            {
                id: 6,
                docsDate: '2025-03-10',
                docsNo: '0930463244',
                docsType: 'Invoice',
                referenceDocsNo: '0920476705',
                company: 'TSM',
                dealerId: '6080102400',
                dealerName: 'BATU PAHAT TYRE & SPORT RIM TRADING',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 721.15,
                deleted: null
            },
            {
                id: 7,
                docsDate: '2025-03-10',
                docsNo: '0930463521',
                docsType: 'Invoice',
                referenceDocsNo: '0920476184',
                company: 'TSM',
                dealerId: '6030900500',
                dealerName: 'MA HOE HENG TYRE & BATTERY',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 390.6,
                deleted: null
            },
            {
                id: 8,
                docsDate: '2025-03-10',
                docsNo: '2000110176',
                docsType: 'Credit Note',
                referenceDocsNo: 'EPD0038742',
                company: 'TSM',
                dealerId: '6071799100',
                dealerName: 'YAMOTOR TYRE SERVICE SDN BHD',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: -215.75,
                deleted: null
            },
            {
                id: 9,
                docsDate: '2025-03-10',
                docsNo: '0930463186',
                docsType: 'Invoice',
                referenceDocsNo: '0920476512',
                company: 'TSM',
                dealerId: '6023101000',
                dealerName: 'MERU TYRES & BATTERIES SERVICES',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 486.2,
                deleted: null
            },
            {
                id: 10,
                docsDate: '2025-03-10',
                docsNo: '0930463238',
                docsType: 'Invoice',
                referenceDocsNo: '0920476586',
                company: 'TSM',
                dealerId: '6050799000',
                dealerName: 'VINFIELD ENTERPRISE SDN BHD',
                download: false,
                created: '2025-03-10',
                updated: '2025-03-10',
                amtdue: 559.3,
                deleted: null
            }
        ];
    },

    // Return first 5 billing records
    getBillingMini() {
        return Promise.resolve(this.getBillingData().slice(0, 5));
    },

    // Return first 10 billing records
    getBillingSmall() {
        return Promise.resolve(this.getBillingData().slice(0, 10));
    },

    // Return all billing records
    getBillingList() {
        return Promise.resolve(this.getBillingData());
    }
};
