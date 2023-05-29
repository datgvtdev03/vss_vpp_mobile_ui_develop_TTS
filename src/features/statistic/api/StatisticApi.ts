import BaseApiService from "src/services/api/BaseApiService";
import {
  Device,
  Position,
  Product,
  ProductTicket,
  Quantity,
  RequestSearchStatistic,
  RequestSearchStatisticAdvance,
  Shift,
  Staff,
  StaffsGroup,
  Stage,
  StatisticDetailData,
  StatisticInformation,
  Unit,
} from "../models/statistic";
import endpoints from "./endpoints";

export const StatisticApi = {
  getStages: () => {
    return BaseApiService.GET<null, Stage[]>(endpoints.v1.getStages(), null);
  },
  getUnits: () => {
    return BaseApiService.GET<null, Unit[]>(endpoints.v1.getUnits(), null);
  },

  getProducts: () => {
    return BaseApiService.GET<null, Product[]>(
      endpoints.v1.getProducts(),
      null
    );
  },
  getProductsByDate: (fromDate: string, toDate: string) => {
    return BaseApiService.GET<null, Product[]>(
      endpoints.v1.getProductsByDate(fromDate, toDate),
      null
    );
  },

  getStaffs: () => {
    return BaseApiService.GET<null, Staff[]>(endpoints.v1.getStaffs(), null);
  },
  getProductTicketByDate: (fromDate: string, toDate: string) => {
    return BaseApiService.GET<null, ProductTicket[]>(
      endpoints.v1.getProductTicketByDate(fromDate, toDate),
      null
    );
  },

  postSearchStatistic: (body: RequestSearchStatistic) => {
    return BaseApiService.POST<RequestSearchStatistic, StatisticInformation[]>(
      endpoints.v1.postSearchStatistic(),
      body
    );
  },

  postSearchStatisticAdvance: (body: RequestSearchStatisticAdvance) => {
    return BaseApiService.POST<
      RequestSearchStatisticAdvance,
      StatisticInformation[]
    >(endpoints.v1.postSearchStatisticAdvance(), body);
  },

  getQuantityByTicket: (statisticTicket: number) => {
    return BaseApiService.GET<null, Quantity[]>(
      endpoints.v1.getQuantityByTicket(statisticTicket),
      null
    );
  },
  getStaffsGroupByTicket: (statisticTicket: number) => {
    return BaseApiService.GET<null, StaffsGroup[]>(
      endpoints.v1.getStaffsGroupByTicket(statisticTicket),
      null
    );
  },

  getStaffInformation: () => {
    return BaseApiService.GET<null, Staff>(
      endpoints.v1.getStaffInformation(),
      null
    );
  },
  getStaffsPosition: () => {
    return BaseApiService.GET<null, Position[]>(
      endpoints.v1.getStaffsPosition(),
      null
    );
  },

  getDevices: () => {
    return BaseApiService.GET<null, Device[]>(endpoints.v1.getDevices(), null);
  },
  getShifts: () => {
    return BaseApiService.GET<null, Shift[]>(endpoints.v1.getShifts(), null);
  },
  getDetailStatistic: (idStatistic: number) => {
    return BaseApiService.GET<null, StatisticDetailData>(
      endpoints.v1.getDetailStatistic(idStatistic),
      null
    );
  },

  postInsertStatistic: (detailStatistic: StatisticDetailData) => {
    return BaseApiService.POST<StatisticDetailData, boolean>(
      endpoints.v1.postInsertStatistic(),
      detailStatistic
    );
  },

  postUpdateStatistic: (detailStatistic: StatisticDetailData) => {
    return BaseApiService.POST<StatisticDetailData, boolean>(
      endpoints.v1.postUpdateStatistic(),
      detailStatistic
    );
  },

  postDeleteStatistic: (idStatistic: number) => {
    return BaseApiService.DELETE<null, boolean>(
      endpoints.v1.postDeleteStatistic(idStatistic),
      null
    );
  },
};
