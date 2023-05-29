const endpoints = {
  v1: {
    getStages: (): string => `/api/congdoan`,
    getUnits: (): string => `/api/donvitinh`,

    getProducts: (): string => `/api/thanhpham`,
    getProductsByDate: (fromDate: string, toDate: string): string =>
      `/api/thanhpham/date?fromDate=${fromDate}&toDate=${toDate}`,

    getStaffs: (): string => `/api/nhanvien`,
    getProductTicketByDate: (fromDate: string, toDate: string): string =>
      `/api/phieusanpham/byDate?fromDate=${fromDate}&toDate=${toDate}`,

    postSearchStatistic: () => `/api/nhapthongke/search`,
    postSearchStatisticAdvance: () => `/api/nhapthongke/advance-search`,

    getQuantityByTicket: (statisticTicket: number): string =>
      `/api/sanluong/${statisticTicket}`,
    getStaffsGroupByTicket: (statisticTicket: number): string =>
      `/api/nhanvien/thongke/${statisticTicket}`,

    getStaffInformation: (): string => `/api/nhanvien/default`,
    getStaffsPosition: (): string => `/api/chucdanh`,

    getDevices: (): string => `/api/thietbi`,
    getShifts: (): string => `/api/calamviec`,

    getDetailStatistic: (idStatistic: number): string =>
      `/api/nhapthongke/detail/${idStatistic}`,

    postInsertStatistic: (): string => `/api/nhapthongke/insert`,
    postUpdateStatistic: (): string => `/api/nhapthongke/update`,
    postDeleteStatistic: (idStatistic: number): string =>
      `/api/nhapthongke/delete/${idStatistic}`,
  },
};

export default endpoints;
