export const listMailSetting = { 
  // Main function to return all events
  getlistMailSettingData() {
    return [
      {
        notification: "SystemAlert",
        email: "admin1@example.com",
        shippoint: "Subang Jaya",
      },
      {
        notification: "Password Reset",
        email: "support@example.com",
        shippoint: "Petaling Jaya",
      },
      {
        notification: "Shipping notification",
        email: "logistics@example.com",
        shippoint: "Shah Alam",
      },
      {
        notification: "SystemAlert",
        email: "admin2@example.com",
        shippoint: "Klang",
      },
      {
        notification: "Password Reset",
        email: "helpdesk@example.com",
        shippoint: "Puchong",
      },
      {
        notification: "Shipping notification",
        email: "warehouse@example.com",
        shippoint: "Cheras",
      },
      {
        notification: "SystemAlert",
        email: "itops@example.com",
        shippoint: "Cyberjaya",
      },
      {
        notification: "Password Reset",
        email: "usercare@example.com",
        shippoint: "Putrajaya",
      },
      {
        notification: "Shipping notification",
        email: "delivery@example.com",
        shippoint: "Bangsar",
      },
      {
        notification: "SystemAlert",
        email: "noc@example.com",
        shippoint: "Damansara",
      },
    ];
  },

  // Return first 5 events
  getlistMailSettingMini() {
    return Promise.resolve(this.getlistMailSettingData().slice(0, 5));
  },

  // Return first 10 events
  getlistMailSettingSmall() {
    return Promise.resolve(this.getlistMailSettingData().slice(0, 10));
  },

  // Return all events
  getlistMailSetting() {
    return Promise.resolve(this.getlistMailSettingData());
  },
};
