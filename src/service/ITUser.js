export const ListUserService = {
    // Main function to return all users
    getListUserData() {
        return [
            {
                id: 1,
                usergroup: 'Technical Consultant',
                username: 'John Doe Son of Ben Dover',
                department: 'Admin',
                mobileno: '01123633103',
                email: 'John@numnum.com',
                statusUser: 0,
                statusGroup: 1,
                deleted: null,
                modules: ['Technical', 'IT']
            },
            {
                id: 2,
                usergroup: 'Human Resources',
                username: 'Alice Johnson',
                department: 'Human Resources',
                mobileno: '01123334455',
                email: 'alice@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['OM']
            },
            {
                id: 3,
                usergroup: 'Information Technology',
                username: 'Bob Smith',
                department: 'IT Support',
                mobileno: '0123456789',
                email: 'bob.smith@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['IT', 'Technical']
            },
            {
                id: 4,
                usergroup: 'Finance',
                username: 'Charlie Brown',
                department: 'Finance',
                mobileno: '0132233445',
                email: 'charlie@company.com',
                statusUser: 0,
                statusGroup: 1,
                deleted: null,
                modules: ['SCM']
            },
            {
                id: 5,
                usergroup: 'Marketing',
                username: 'Diana Prince',
                department: 'Marketing',
                mobileno: '0145566778',
                email: 'diana.prince@company.com',
                statusUser: 1,
                statusGroup: 0,
                deleted: null,
                modules: ['Marketing']
            },
            {
                id: 6,
                usergroup: 'Sales',
                username: 'Edward Cullen',
                department: 'Sales',
                mobileno: '0156677889',
                email: 'edward@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['Sales', 'SCM']
            },
            {
                id: 7,
                usergroup: 'Operations',
                username: 'Fiona Gallagher',
                department: 'Operations',
                mobileno: '0167788990',
                email: 'fiona@company.com',
                statusUser: 0,
                statusGroup: 1,
                deleted: null,
                modules: ['OM']
            },
            {
                id: 8,
                usergroup: 'Engineering',
                username: 'George Harris',
                department: 'Engineering',
                mobileno: '0178899001',
                email: 'george@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['Technical', 'SCM']
            },
            {
                id: 9,
                usergroup: 'Quality Assurance',
                username: 'Helen Lee',
                department: 'Quality Assurance',
                mobileno: '0189900112',
                email: 'helen@company.com',
                statusUser: 1,
                statusGroup: 1,
                deleted: null,
                modules: ['OM', 'IT']
            },
            {
                id: 10,
                usergroup: 'Administration',
                username: 'Ian Wright',
                department: 'Administration',
                mobileno: '0191001122',
                email: 'ian.wright@company.com',
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
