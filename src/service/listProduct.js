export const ListTyreService = {
    getListTyreData() {
        return [
            {
                id: 1,
                warrantyRegisterID: 1001,
                materialid: '81114NE0304175H',
                itemdesc: '215/45R17 91W',
                pattern: 'Proxes',
                subpattern: 'T1R',
                rimDiameter: 17,
                aspectRatio: '45',
                sectionWidth: '215',
                tyreSize: '215/45R17',
                loadIndex: '91',
                plyRating: 'XL',
                deleted: null,
                status: 'Non-Warranty',
                size: '215/45R17',
                origin: 'Japan',
                desc: 'High-performance tire for sports cars and sedans',
                mfgcode: 'MFG-2025-001',
                tyresize: 'Passenger Car',
                tyrespec: '91W',
                weekcode: '3524',
                imageURL: '/demo/images/toyor_tayar1.png'
            },
            {
                id: 2,
                warrantyRegisterID: 1002,
                materialid: '81114NE0304176H',
                itemdesc: '265/65R18 114S',
                pattern: 'Open Country',
                subpattern: 'A/T III',
                rimDiameter: 18,
                aspectRatio: '65',
                sectionWidth: '265',
                tyreSize: '265/65R18',
                loadIndex: '114',
                plyRating: '10PR',
                deleted: null,
                status: 'Warranty',
                size: '265/65R18',
                origin: 'Thailand',
                desc: 'All-terrain tire designed for SUVs and light trucks',
                mfgcode: 'MFG-2025-002',
                tyresize: 'SUV',
                tyrespec: '114S',
                weekcode: '3324',
                imageURL: '/demo/images/toyor_tayar2.png'
            },
            {
                id: 3,
                warrantyRegisterID: 1003,
                materialid: '81114NE0304177H',
                itemdesc: '245/40R19 98Y',
                pattern: 'Proxes',
                subpattern: 'Sport',
                rimDiameter: 19,
                aspectRatio: '40',
                sectionWidth: '245',
                tyreSize: '245/40R19',
                loadIndex: '98',
                plyRating: 'XL',
                deleted: null,
                status: 'Warranty',
                size: '245/40R19',
                origin: 'Japan',
                desc: 'Ultra high-performance tire for superior grip and handling',
                mfgcode: 'MFG-2025-003',
                tyresize: 'Passenger Car',
                tyrespec: '98Y',
                weekcode: '3224',
                imageURL: '/demo/images/toyor_tayar3.png'
            },
            {
                id: 4,
                warrantyRegisterID: 1004,
                materialid: '81114NE0304178H',
                itemdesc: '205/55R16 91H',
                pattern: 'NanoEnergy',
                subpattern: '3 Plus',
                rimDiameter: 16,
                aspectRatio: '55',
                sectionWidth: '205',
                tyreSize: '205/55R16',
                loadIndex: '91',
                plyRating: 'Standard',
                deleted: null,
                status: 'Non-Warranty',
                size: '205/55R16',
                origin: 'Malaysia',
                desc: 'Eco-friendly tire for fuel efficiency and comfort',
                mfgcode: 'MFG-2025-004',
                tyresize: 'Passenger Car',
                tyrespec: '91H',
                weekcode: '3124',
                imageURL: '/demo/images/toyor_tayar4.png'
            },
            {
                id: 5,
                warrantyRegisterID: 1005,
                materialid: '81114NE0304179H',
                itemdesc: '285/70R17 121Q',
                pattern: 'Open Country',
                subpattern: 'M/T',
                rimDiameter: 17,
                aspectRatio: '70',
                sectionWidth: '285',
                tyreSize: '285/70R17',
                loadIndex: '121',
                plyRating: '10PR',
                deleted: null,
                status: 'Warranty',
                size: '285/70R17',
                origin: 'Thailand',
                desc: 'Mud-terrain tire built for rugged off-road performance',
                mfgcode: 'MFG-2025-005',
                tyresize: 'Truck',
                tyrespec: '121Q',
                weekcode: '2924',
                imageURL: '/demo/images/toyor_tayar5.png'
            },
            {
                id: 6,
                warrantyRegisterID: 1006,
                materialid: '81114NE0304180H',
                itemdesc: '195/50R15 82V',
                pattern: 'Proxes',
                subpattern: 'R1R',
                rimDiameter: 15,
                aspectRatio: '50',
                sectionWidth: '195',
                tyreSize: '195/50R15',
                loadIndex: '82',
                plyRating: 'Standard',
                deleted: null,
                status: 'Non-Warranty',
                size: '195/50R15',
                origin: 'Japan',
                desc: 'Street sports tire for superior cornering and braking',
                mfgcode: 'MFG-2025-006',
                tyresize: 'Passenger Car',
                tyrespec: '82V',
                weekcode: '3024',
                imageURL: '/demo/images/toyor_tayar6.png'
            }
        ];
    },

    getListTwpTyresData() {
        return [
            { id: 1, materialid: '81114NE0304175H', tyreSize: '215/45R17', pattern: 'Proxes T1R', imageURL: '/demo/images/toyor_tayar1.png' },
            { id: 2, materialid: '81114NE0304176H', tyreSize: '265/65R18', pattern: 'Open Country A/T III', imageURL: '/demo/images/toyor_tayar2.png' },
            { id: 3, materialid: '81114NE0304177H', tyreSize: '245/40R19', pattern: 'Proxes Sport', imageURL: '/demo/images/toyor_tayar3.png' },
            { id: 4, materialid: '81114NE0304179H', tyreSize: '285/70R17', pattern: 'Open Country M/T', imageURL: '/demo/images/toyor_tayar5.png' }
        ];
    },

    getListTyreMini() {
        return Promise.resolve(this.getListTyreData().slice(0, 5));
    },

    getListTyreSmall() {
        return Promise.resolve(this.getListTyreData().slice(0, 10));
    },

    getListTyre() {
        return Promise.resolve(this.getListTyreData());
    },

    getListTwpTyres() {
        return Promise.resolve(this.getListTwpTyresData());
    }
};
