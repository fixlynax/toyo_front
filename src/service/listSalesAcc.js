export const ListSalesAccount = {
    // Main function to return all events
    getListSalesAccountData() {
        return [
            {
                id: 1,
                district: 'North',
                Name: 'Ben Dover',
                status: 1,
                title: 'Salesman',
                email: 'ben.dover@sales.com',
                mobile: '0112345678',
                salesOffice: 'Penang',
                salesDistrict: 'North',
                placeorder: 1,
                deleted: null
            },
            {
                id: 2,
                district: 'South',
                Name: 'Phil McCracken',
                status: 1,
                title: 'Salesman',
                email: 'phil.mccracken@sales.com',
                mobile: '0123456789',
                salesOffice: 'Johor',
                salesDistrict: 'South',
                placeorder: 1,
                deleted: null
            },
            {
                id: 3,
                district: 'East',
                Name: 'Anita Bath',
                status: 1,
                title: 'Saleswoman',
                email: 'anita.bath@sales.com',
                mobile: '0132345678',
                salesOffice: 'Terengganu',
                salesDistrict: 'East',
                placeorder: 0,
                deleted: null
            },
            {
                id: 4,
                district: 'Central',
                Name: 'Hugh Jass',
                status: 0,
                title: 'Salesman',
                email: 'hugh.jass@sales.com',
                mobile: '0143456789',
                salesOffice: 'Kuala Lumpur',
                salesDistrict: 'Central',
                placeorder: 1,
                deleted: null
            },
            {
                id: 5,
                district: 'North',
                Name: 'Pat Myaz',
                status: 1,
                title: 'Senior Sales',
                email: 'pat.myaz@sales.com',
                mobile: '0152345678',
                salesOffice: 'Penang',
                salesDistrict: 'North',
                placeorder: 1,
                deleted: null
            },
            {
                id: 6,
                district: 'South',
                Name: 'Mike Rotch',
                status: 1,
                title: 'Salesman',
                email: 'mike.rotch@sales.com',
                mobile: '0163456789',
                salesOffice: 'Johor',
                salesDistrict: 'South',
                placeorder: 0,
                deleted: null
            },
            {
                id: 7,
                district: 'East',
                Name: 'Gabe Itch',
                status: 1,
                title: 'Saleswoman',
                email: 'gabe.itch@sales.com',
                mobile: '0172345678',
                salesOffice: 'Kuantan',
                salesDistrict: 'East',
                placeorder: 1,
                deleted: null
            },
            {
                id: 8,
                district: 'Central',
                Name: 'Al Beback',
                status: 1,
                title: 'Sales Executive',
                email: 'al.beback@sales.com',
                mobile: '0183456789',
                salesOffice: 'Kuala Lumpur',
                salesDistrict: 'Central',
                placeorder: 1,
                deleted: null
            },
            {
                id: 9,
                district: 'North',
                Name: 'Ivana Tinkle',
                status: 0,
                title: 'Saleswoman',
                email: 'ivana.tinkle@sales.com',
                mobile: '0192345678',
                salesOffice: 'Penang',
                salesDistrict: 'North',
                placeorder: 0,
                deleted: null
            },
            {
                id: 10,
                district: 'South',
                Name: 'Justin Case',
                status: 1,
                title: 'Sales Manager',
                email: 'justin.case@sales.com',
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
