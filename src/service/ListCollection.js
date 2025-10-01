export const ListCollectionService = { 
  // Main function to return all events
  getListCollectionData() {
    return [
      {
        id: 1,
        collectDate: "2025-02-16",
        collectTime: "12:04:20",
        status: 1,
        collectRef: "WR21331",
        dealerName: "Dann Garage",
        dealerContact: "012-3456789",
        dealerLoc: "Subang Jaya",
        collectSchedule: "2025-02-16 10:00:00",
        totalTire: "4",
        updated: "2025-01-05",
        created: "2025-01-05",
        deleted: null,
      },
      {
        id: 2,
        collectDate: "2025-02-18",
        collectTime: "09:30:45",
        status: 0,
        collectRef: "WR21332",
        dealerName: "Ah Chong Auto",
        dealerContact: "013-2233445",
        dealerLoc: "Petaling Jaya",
        collectSchedule: "2025-02-18 09:00:00",
        totalTire: "6",
        updated: "2025-01-06",
        created: "2025-01-06",
        deleted: null,
      },
      {
        id: 3,
        collectDate: "2025-02-20",
        collectTime: "14:15:10",
        status: 1,
        collectRef: "WR21333",
        dealerName: "Hassan Workshop",
        dealerContact: "017-9988776",
        dealerLoc: "Shah Alam",
        collectSchedule: "2025-02-20 13:30:00",
        totalTire: "8",
        updated: "2025-01-07",
        created: "2025-01-07",
        deleted: null,
      },
      {
        id: 4,
        collectDate: "2025-02-22",
        collectTime: "16:45:05",
        status: 2,
        collectRef: "WR21334",
        dealerName: "Lim Brothers Auto",
        dealerContact: "016-4455667",
        dealerLoc: "Klang",
        collectSchedule: "2025-02-22 16:00:00",
        totalTire: "10",
        updated: "2025-01-08",
        created: "2025-01-08",
        deleted: null,
      },
      {
        id: 5,
        collectDate: "2025-02-25",
        collectTime: "11:20:55",
        status: 1,
        collectRef: "WR21335",
        dealerName: "Muthu Auto Services",
        dealerContact: "019-5566778",
        dealerLoc: "Puchong",
        collectSchedule: "2025-02-25 11:00:00",
        totalTire: "12",
        updated: "2025-01-09",
        created: "2025-01-09",
        deleted: null,
      },
      {
        id: 6,
        collectDate: "2025-02-28",
        collectTime: "15:55:30",
        status: 0,
        collectRef: "WR21336",
        dealerName: "Ali Auto Tyres",
        dealerContact: "018-1122334",
        dealerLoc: "Cheras",
        collectSchedule: "2025-02-28 15:30:00",
        totalTire: "5",
        updated: "2025-01-10",
        created: "2025-01-10",
        deleted: null,
      },
    ];

  },

  // Return first 5 events
  getListCollectionMini() {
    return Promise.resolve(this.getListCollectionData().slice(0, 5));
  },

  // Return first 10 events
  getListCollectionSmall() {
    return Promise.resolve(this.getListCollectionData().slice(0, 10));
  },

  // Return all events
  getListCollection() {
    return Promise.resolve(this.getListCollectionData());
  },
};