// /branch/getBranch
export type Branch = {
  address: string;
  areaId: number;
  branchCode: string;
  branchId: number;
  branchManager: string;
  branchName: string;
  branchShortName: string;
  branchTypeId: number;
  companyId: number;
  companyTitle: string;
  description: string;
  districtId: number;
  email: string;
  fax: string;
  isActive: number;
  isCenterBranch: number;
  isSystem: number;
  orderIndex: number;
  phoneNumber: string;
  provinceId: number;
  sinvoicePassword: string;
  sinvoiceUserName: string;
  taxAddress: string;
  taxCode: string;
  wardId: number;
  website: string;
};

// /branch/getCustomerBranch
export interface CustomerBranch {
  branchEmail: string;
  branchAddress: string;
  branchMobile: string;
  branchPhone: string;
  branchWebsite: string;
  customerBranchId: number;
  customerBranchName: string;
  customerId: number;
  description: string;
  isActive: number;
  isCanpurchaseOrder: number;
  isSystem: number;
  salesManName: string;
}
