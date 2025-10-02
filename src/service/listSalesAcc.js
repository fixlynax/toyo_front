export const ListSalesAccount = {
    // Main function to return all events
    getListSalesAccountData() {
        return [
            {
                id: 1,
                district: 'North',
                Name: 'Ahmad Zaki',
                status: 1,
                title: 'Salesman',
                email: 'ahmad.zaki@sales.com',
                mobile: '0112345678',
                salesOffice: 'Penang',
                salesDistrict: 'North',
                placeorder: 1,
                deleted: null
            },
            {
                id: 2,
                district: 'South',
                Name: 'Lim Wei Jian',
                status: 1,
                title: 'Salesman',
                email: 'lim.weijian@sales.com',
                mobile: '0123456789',
                salesOffice: 'Johor',
                salesDistrict: 'South',
                placeorder: 1,
                deleted: null
            },
            {
                id: 3,
                district: 'East',
                Name: 'Siti Nur Aini',
                status: 1,
                title: 'Saleswoman',
                email: 'siti.nuraini@sales.com',
                mobile: '0132345678',
                salesOffice: 'Terengganu',
                salesDistrict: 'East',
                placeorder: 0,
                deleted: null
            },
            {
                id: 4,
                district: 'Central',
                Name: 'Raj Kumar',
                status: 0,
                title: 'Salesman',
                email: 'raj.kumar@sales.com',
                mobile: '0143456789',
                salesOffice: 'Kuala Lumpur',
                salesDistrict: 'Central',
                placeorder: 1,
                deleted: null
            },
            {
                id: 5,
                district: 'North',
                Name: 'Tan Mei Ling',
                status: 1,
                title: 'Senior Sales',
                email: 'tan.meiling@sales.com',
                mobile: '0152345678',
                salesOffice: 'Penang',
                salesDistrict: 'North',
                placeorder: 1,
                deleted: null
            },
            {
                id: 6,
                district: 'South',
                Name: 'Mohd Faiz',
                status: 1,
                title: 'Salesman',
                email: 'mohd.faiz@sales.com',
                mobile: '0163456789',
                salesOffice: 'Johor',
                salesDistrict: 'South',
                placeorder: 0,
                deleted: null
            },
            {
                id: 7,
                district: 'East',
                Name: 'Nurul Huda',
                status: 1,
                title: 'Saleswoman',
                email: 'nurul.huda@sales.com',
                mobile: '0172345678',
                salesOffice: 'Kuantan',
                salesDistrict: 'East',
                placeorder: 1,
                deleted: null
            },
            {
                id: 8,
                district: 'Central',
                Name: 'James Lee',
                status: 1,
                title: 'Sales Executive',
                email: 'james.lee@sales.com',
                mobile: '0183456789',
                salesOffice: 'Kuala Lumpur',
                salesDistrict: 'Central',
                placeorder: 1,
                deleted: null
            },
            {
                id: 9,
                district: 'North',
                Name: 'Aminah Hassan',
                status: 0,
                title: 'Saleswoman',
                email: 'aminah.hassan@sales.com',
                mobile: '0192345678',
                salesOffice: 'Penang',
                salesDistrict: 'North',
                placeorder: 0,
                deleted: null
            },
            {
                id: 10,
                district: 'South',
                Name: 'Chong Wei',
                status: 1,
                title: 'Sales Manager',
                email: 'chong.wei@sales.com',
                mobile: '0103456789',
                salesOffice: 'Johor',
                salesDistrict: 'South',
                placeorder: 1,
                deleted: null
            }
        ];
    },

    // Return first 5 events
    getListSalesAccountMini() {
        return Promise.resolve(this.getListSalesAccountData().slice(0, 5));
    },

    // Return first 10 events
    getListSalesAccountSmall() {
        return Promise.resolve(this.getListSalesAccountData().slice(0, 10));
    },

    // Return all events
    getListSalesAccount() {
        return Promise.resolve(this.getListSalesAccountData());
    }
};
