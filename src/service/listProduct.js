export const ListTyreService = {
    getListTyreData() {
        return [
            {
                id: 1,
                pattern: 'Proxes T1R',
                rimDiameter: 17,
                aspectRatio: '45',
                sectionWidth: '215',
                tyreSize: '215/45R17',
                loadIndex: '91',
                plyRating: 'XL',
                deleted: null,
                status: 'Non-Waranty',
                size: '215/45R17',
                origin: 'Japan'
            },
            {
                id: 2,
                pattern: 'Open Country A/T III',
                rimDiameter: 18,
                aspectRatio: '65',
                sectionWidth: '265',
                tyreSize: '265/65R18',
                loadIndex: '114',
                plyRating: '10PR',
                deleted: null,
                status: 'Waranty',
                size: '265/65R18',
                origin: 'Thailand'
            },
            {
                id: 3,
                pattern: 'Proxes Sport',
                rimDiameter: 19,
                aspectRatio: '40',
                sectionWidth: '245',
                tyreSize: '245/40R19',
                loadIndex: '98',
                plyRating: 'XL',
                deleted: null,
                status: 'Waranty',
                size: '245/40R19',
                origin: 'Japan'
            },
            {
                id: 4,
                pattern: 'Observe GSi-6',
                rimDiameter: 16,
                aspectRatio: '55',
                sectionWidth: '205',
                tyreSize: '205/55R16',
                loadIndex: '91',
                plyRating: 'Standard',
                deleted: null,
                status: 'Non-Waranty',
                size: '205/55R16',
                origin: 'Malaysia'
            },
            {
                id: 5,
                pattern: 'Open Country M/T',
                rimDiameter: 17,
                aspectRatio: '70',
                sectionWidth: '285',
                tyreSize: '285/70R17',
                loadIndex: '121',
                plyRating: '10PR',
                deleted: null,
                status: 'Waranty',
                size: '285/70R17',
                origin: 'Thailand'
            },
            {
                id: 6,
                pattern: 'Proxes R1R',
                rimDiameter: 15,
                aspectRatio: '50',
                sectionWidth: '195',
                tyreSize: '195/50R15',
                loadIndex: '82',
                plyRating: 'Standard',
                deleted: null,
                status: 'Non-Waranty',
                size: '195/50R15',
                origin: 'Japan'
            },
            {
                id: 7,
                pattern: 'Open Country H/T',
                rimDiameter: 20,
                aspectRatio: '55',
                sectionWidth: '275',
                tyreSize: '275/55R20',
                loadIndex: '113',
                plyRating: '8PR',
                deleted: null,
                status: 'Waranty',
                size: '275/55R20',
                origin: 'Malaysia'
            },
            {
                id: 8,
                pattern: 'Proxes ST III',
                rimDiameter: 19,
                aspectRatio: '45',
                sectionWidth: '255',
                tyreSize: '255/45R19',
                loadIndex: '104',
                plyRating: 'XL',
                deleted: null,
                status: 'Non-Waranty',
                size: '255/45R19',
                origin: 'Japan'
            },
            {
                id: 9,
                pattern: 'Open Country R/T',
                rimDiameter: 17,
                aspectRatio: '65',
                sectionWidth: '265',
                tyreSize: '265/65R17',
                loadIndex: '120',
                plyRating: '10PR',
                deleted: null,
                status: 'Non-Waranty',
                size: '265/65R17',
                origin: 'Thailand'
            },
            {
                id: 10,
                pattern: 'Proxes T1 Sport SUV',
                rimDiameter: 21,
                aspectRatio: '35',
                sectionWidth: '275',
                tyreSize: '275/35R21',
                loadIndex: '103',
                plyRating: 'XL',
                deleted: null,
                status: 'Waranty',
                size: '275/35R21',
                origin: 'Japan'
            }
        ];
    },

    getListTwpTyresData() {
        return [
            { id: 1, tyreSize: '215/45R17', pattern: 'Proxes T1R',},
            { id: 2, tyreSize: '265/65R18', pattern: 'Open Country A/T III' },
            { id: 3, tyreSize: '245/40R19', pattern: 'Proxes Sport' },
            { id: 4, tyreSize: '285/70R17', pattern: 'Open Country M/T' }
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
