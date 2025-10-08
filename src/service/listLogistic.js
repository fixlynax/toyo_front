export const ListLogisticService = { 
    getListLogisticData() { 
        return [
  {
    "companyName": "JNT Logistics",
    "contactPerson": "John Doe",
    "contactNo": "123-456-7890",
    "address": "123 JNT Street",
    "city": "Bangkok",
    "postcode": "10110",
    "state": "Bangkok",
    "email": "contact@jntlogistics.com",
    "username": "jnt_user01",
    "status": "Active",
    "shippingPoints": ["JNT"],
    "createdSince": "2023-01-15T09:30:00",
    "lastLogin": "2023-10-01T14:45:00"
  },
  {
    "companyName": "DHL Express",
    "contactPerson": "Jane Smith",
    "contactNo": "987-654-3210",
    "address": "456 DHL Avenue",
    "city": "Chiang Mai",
    "postcode": "50200",
    "state": "Chiang Mai",
    "email": "jane.smith@dhl.com",
    "username": "dhl_user01",
    "status": "Active",
    "shippingPoints": ["DHL"],
    "createdSince": "2022-11-20T11:00:00",
    "lastLogin": "2023-09-25T10:15:00"
  },
  {
    "companyName": "Lalamove Logistics",
    "contactPerson": "Alex Tan",
    "contactNo": "555-123-4567",
    "address": "789 Lalamove Road",
    "city": "Phuket",
    "postcode": "83000",
    "state": "Phuket",
    "email": "alex.tan@lalamove.com",
    "username": "lalamove_user01",
    "status": "Inactive",
    "shippingPoints": ["Lalamove"],
    "createdSince": "2023-03-10T08:45:00",
    "lastLogin": "2023-08-30T16:20:00"
  },
  {
    "companyName": "FastShip Co.",
    "contactPerson": "Sara Lee",
    "contactNo": "321-654-9870",
    "address": "321 FastShip Blvd",
    "city": "Hat Yai",
    "postcode": "90110",
    "state": "Songkhla",
    "email": "sara.lee@fastship.com",
    "username": "fastship_user01",
    "status": "Active",
    "shippingPoints": ["JNT", "Lalamove"],
    "createdSince": "2022-06-05T14:00:00",
    "lastLogin": "2023-09-20T09:30:00"
  },
  {
    "companyName": "ExpressWay Logistics",
    "contactPerson": "Michael Chong",
    "contactNo": "666-777-8888",
    "address": "101 Expressway",
    "city": "Nakhon Ratchasima",
    "postcode": "30000",
    "state": "Nakhon Ratchasima",
    "email": "michael.chong@expressway.com",
    "username": "expressway_user",
    "status": "Active",
    "shippingPoints": ["DHL"],
    "createdSince": "2021-12-01T10:15:00",
    "lastLogin": "2023-09-28T17:10:00"
  },
  {
    "companyName": "Speedy Delivery",
    "contactPerson": "Nina Patel",
    "contactNo": "222-333-4444",
    "address": "555 Speedy Lane",
    "city": "Udon Thani",
    "postcode": "41000",
    "state": "Udon Thani",
    "email": "nina.patel@speedydelivery.com",
    "username": "speedy_user",
    "status": "Inactive",
    "shippingPoints": ["JNT"],
    "createdSince": "2020-08-10T13:45:00",
    "lastLogin": "2022-12-15T12:00:00"
  },
  {
    "companyName": "GlobalShip",
    "contactPerson": "Tom Nguyen",
    "contactNo": "777-888-9999",
    "address": "789 Global Street",
    "city": "Khon Kaen",
    "postcode": "40000",
    "state": "Khon Kaen",
    "email": "tom.nguyen@globalship.com",
    "username": "globalship_user",
    "status": "Active",
    "shippingPoints": ["Lalamove"],
    "createdSince": "2022-03-22T09:00:00",
    "lastLogin": "2023-10-02T11:45:00"
  },
  {
    "companyName": "NextDay Logistics",
    "contactPerson": "Emma Watson",
    "contactNo": "888-222-3333",
    "address": "123 NextDay Road",
    "city": "Chonburi",
    "postcode": "20000",
    "state": "Chonburi",
    "email": "emma.watson@nextday.com",
    "username": "nextday_user",
    "status": "Active",
    "shippingPoints": ["DHL", "Lalamove"],
    "createdSince": "2021-05-15T16:30:00",
    "lastLogin": "2023-09-30T15:20:00"
  },
  {
    "companyName": "ExpressFast",
    "contactPerson": "Carlos Mendez",
    "contactNo": "444-555-6666",
    "address": "456 Express Fast Lane",
    "city": "Rayong",
    "postcode": "21150",
    "state": "Rayong",
    "email": "carlos.mendez@expressfast.com",
    "username": "expressfast_user",
    "status": "Inactive",
    "shippingPoints": ["JNT"],
    "createdSince": "2020-05-01T08:00:00",
    "lastLogin": "2022-10-10T09:00:00"
  }
];
    },

    getListOrderMini() { 
        return Promise.resolve(this.getListOrderData().slice(0, 5));
    },

    getListOrderSmall() { 
        return Promise.resolve(this.getListOrderData().slice(0, 10));
    },

    getListOrder() { 
        return Promise.resolve(this.getListOrderData());
    },
};
