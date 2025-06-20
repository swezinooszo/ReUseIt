export const categoryFormFields = {

    // iPhone
    '684c8b28e6ad394af4b0c875': {
    fields: [
      {
        key: 'Series',
        label: 'Series',
        type: 'select',
        options: ['iPhone 11 Series', 'iPhone 12 Series', 'iPhone 13 Series', 'iPhone 14 Series','iPhone 15 Series','iPhone 16 Series','Others'],
        placeholder: '',
      },
      {
        key: 'storage',
        label: 'Storage',
        type: 'text',
        placeholder: 'e.g. 256GB',
      },
    ],
  },

    // Android Phones
    '684c8b4fe6ad394af4b0c877': {
    fields: [
      {
        key: 'Brand',
        label: 'Brand',
        type: 'select',
        options: ['Asus', 'Google Pixel', 'Huawei', 'LG','Samsung','Vivo','Xiaomi','Others'],
        placeholder: '',
      },
      {
        key: 'storage',
        label: 'Storage',
        type: 'text',
        placeholder: 'e.g. 256GB',
      },
    ],
  },

    // Tablets
  '684c8b65e6ad394af4b0c879': {
    fields: [
      {
        key: 'Tablets',
        label: 'Tablets',
        type: 'select',
        options: ['Android', 'iPad', 'Windows', 'Others'],
        placeholder: '',
      },
      {
        key: 'storage',
        label: 'Storage',
        type: 'text',
        placeholder: 'e.g. 256GB',
      },
    ],
  },

  // Smart Watches
  '684c8b6fe6ad394af4b0c87b': {
    fields: [
      {
        key: 'Brand',
        label: 'Brand',
        type: 'select',
        options: ['Apple', 'Samsung', 'Huawei', 'Xiaomi','Others'],
        placeholder: '',
      },
    ],
  },
  // Add more categories similarly
};
