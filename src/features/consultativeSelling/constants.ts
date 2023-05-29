export enum StatusIds {
  All = "-1",
  Uncensored = "1",
  Reject = "2",
  Agree = "3",
}

export const StatusName = {
  [StatusIds.All]: "Tất cả",
  [StatusIds.Uncensored]: "1 - Chưa duyệt",
  [StatusIds.Reject]: "2 - Từ chối",
  [StatusIds.Agree]: "3 - Đồng ý",
};

export const DEFAULT_CONFIG_PHONE_NUMBER =
  "039,038,037,036,035,034,033,032,070,079,077,076,078,085,084,083,082,081,0564,0563,0584,0585,0586,0587,0588,0589,0583,0565,0566,0567,0568,0569,0582,0592,0593,0598,0599,090,091,092,093,094,095,096,097,098,099,028,083,366,086,088,089";
