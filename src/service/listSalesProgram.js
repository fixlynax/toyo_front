export const ListSalesProgramService = {
    getListSalesProgramData() {
        return [
            {
                programId: 'ABC1234',
                etenUserID: '1,7,11',
                priceGroup: '06',
                type: 'FOC',
                title: 'Buy and Get Free',
                desc: 'Something',
                image: null,
                startDate: '2025-09-01',
                endDate: '2025-10-30',
                status: 1,
                created: '2025-09-08 00:00:00'
            },
            {
                programId: 'ABC4321',
                etenUserID: '1,5,10,12,13,11,7',
                priceGroup: '06',
                type: 'FOC',
                title: 'Year End Discount',
                desc: 'Something',
                image: null,
                startDate: '2025-09-01',
                endDate: '2025-10-30',
                status: 1,
                created: '2025-09-08 00:00:00'
            },
            {
                programId: 'SP001',
                etenUserID: '1,7,11',
                priceGroup: '06',
                type: 'FOC',
                title: 'Black Friday',
                desc: "Let's enjoy with MORE DEALS",
                image: null,
                startDate: '2025-09-15',
                endDate: '2025-11-30',
                status: 1,
                created: null
            },
            {
                programId: 'SP002',
                etenUserID: '2,4,6',
                priceGroup: '08',
                type: 'MARKDOWN',
                title: 'Holiday Special',
                desc: 'Enjoy holiday discounts on selected items',
                image: null,
                startDate: '2025-12-01',
                endDate: '2025-12-31',
                status: 1,
                created: '2025-09-20 00:00:00'
            },
            {
                programId: 'SP003',
                etenUserID: '9,10,11',
                priceGroup: '07',
                type: 'FOC',
                title: 'Mid-Year Madness',
                desc: 'Half-year sale with bundle deals',
                image: null,
                startDate: '2025-06-01',
                endDate: '2025-06-30',
                status: 1,
                created: '2025-05-20 00:00:00'
            },
            {
                programId: 'SP004',
                etenUserID: '3,5,8',
                priceGroup: '05',
                type: 'MARKDOWN',
                title: 'Back to School',
                desc: 'Special discounts for school essentials',
                image: null,
                startDate: '2025-08-01',
                endDate: '2025-08-31',
                status: 1,
                created: '2025-07-15 00:00:00'
            },
            {
                programId: 'SP005',
                etenUserID: '1,2,3,4',
                priceGroup: '09',
                type: 'FOC',
                title: 'Mega Clearance',
                desc: 'End-of-season clearance with huge discounts',
                image: null,
                startDate: '2025-11-01',
                endDate: '2025-11-15',
                status: 1,
                created: '2025-10-01 00:00:00'
            }
        ];
    },

    getListSalesProgramMini() {
        return Promise.resolve(this.getListSalesProgramData().slice(0, 5));
    },

    getListSalesProgramSmall() {
        return Promise.resolve(this.getListSalesProgramData().slice(0, 10));
    },

    getListSalesProgram() {
        return Promise.resolve(this.getListSalesProgramData());
    }
};
