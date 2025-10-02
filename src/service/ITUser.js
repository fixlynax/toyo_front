export const ListUserService = {
    // Main function to return all users
    getListUserData() {
        return [
            {
                id: 1,
                usergroup: 'Technical Consultant',
                username: 'Ben Dover',
                department: 'Admin',
                mobileno: '01123633103',
                email: 'ben.dover@numnum.com',
                statusUser: 0,
                statusGroup: 1,
                deleted: null,
                modules: ['Technical', 'IT']
            },
            {
                id: 2,
                usergroup: 'Human Resources',
                username: 'Mike Rotch',
                department: 'Human Resources',
                mobileno: '01123334455',
                email: 'mike.rotch@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['OM']
            },
            {
                id: 3,
                usergroup: 'Information Technology',
                username: 'Seymour Butts',
                department: 'IT Support',
                mobileno: '0123456789',
                email: 'seymour.butts@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['IT', 'Technical']
            },
            {
                id: 4,
                usergroup: 'Finance',
                username: 'Ivana Tinkle',
                department: 'Finance',
                mobileno: '0132233445',
                email: 'ivana.tinkle@company.com',
                statusUser: 0,
                statusGroup: 1,
                deleted: null,
                modules: ['SCM']
            },
            {
                id: 5,
                usergroup: 'Marketing',
                username: 'Hugh Jass',
                department: 'Marketing',
                mobileno: '0145566778',
                email: 'hugh.jass@company.com',
                statusUser: 1,
                statusGroup: 0,
                deleted: null,
                modules: ['Marketing']
            },
            {
                id: 6,
                usergroup: 'Sales',
                username: 'Anita Bath',
                department: 'Sales',
                mobileno: '0156677889',
                email: 'anita.bath@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['Sales', 'SCM']
            },
            {
                id: 7,
                usergroup: 'Operations',
                username: 'Al Coholic',
                department: 'Operations',
                mobileno: '0167788990',
                email: 'al.coholic@company.com',
                statusUser: 0,
                statusGroup: 1,
                deleted: null,
                modules: ['OM']
            },
            {
                id: 8,
                usergroup: 'Engineering',
                username: 'Justin Case',
                department: 'Engineering',
                mobileno: '0178899001',
                email: 'justin.case@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['Technical', 'SCM']
            },
            {
                id: 9,
                usergroup: 'Quality Assurance',
                username: 'Maya Normous',
                department: 'Quality Assurance',
                mobileno: '0189900112',
                email: 'maya.normous@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['OM', 'IT']
            },
            {
                id: 10,
                usergroup: 'Administration',
                username: 'Phil McCrakin',
                department: 'Administration',
                mobileno: '0191001122',
                email: 'phil.mccrakin@company.com',
                statusUser: 0,
                statusGroup: 0,
                deleted: null,
                modules: ['SCM', 'Sales']
            }
        ];
    },

    // Return first 5 users
    getListUserMini() {
        return Promise.resolve(this.getListUserData().slice(0, 5));
    },

    // Return first 10 users
    getListUserSmall() {
        return Promise.resolve(this.getListUserData().slice(0, 10));
    },

    // Return all users
    getListUser() {
        return Promise.resolve(this.getListUserData());
    }
};
