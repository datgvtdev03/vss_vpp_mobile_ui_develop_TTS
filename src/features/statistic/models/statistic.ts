// /api/congdoan
export interface Stage {
  id: number;
  maBd: string;
  tenCongDoan: string;
}

export interface Unit {
  maDonViTinh: number;
  maDonViTinhBD: string;
  tenDonViTinh: string;
}

export interface Product {
  maThanhPham: number;
  maThanhPhamBD: string;
  tenThanhPham: string;
  sysdate: number;
  displayName?: string;
}

export interface Staff {
  maNhanVien: number;
  maNhanVienBD: string;
  hoTen: string;
  idChucDanhNv: number;
  dienThoai: string;
  email: string;
  ngaySinh: string | null;
  gioiTinh: string;
  diaChi: string;
  tenChucDanh: string;
  bitTruongCa: boolean;
  displayName?: string;
  id?: number;
  status?: number | null;
}

export interface ProductTicket {
  id: number;
  soPhieuSp: string;
  soPhieuSPCon: string;
  ngayPsp: number;
  soLuong: number;
  kichThuoc: string;
  ghiChu: string;
  tenSpCon: string;
  idThanhPham: number;
  tenThanhPham: string;
}

export interface RequestSearchStatistic {
  fromDate: string;
  toDate: string;
  keyword: string;
}

export interface RequestSearchStatisticAdvance {
  fromDate: string;
  toDate: string;
  keyword: string;
  maCongDoan: number | null;
  maThanhPham: number | null;
  soPhieuSp: string | null;
  maNhanVien: number | null;
}
export interface StatisticInformation {
  id: number;
  soPhieu: number;
  ngayNhap: number;
  idThietBi: number;
  idCa: number;
  ghiChu: string;
  nhanVien: string;
  tenCa: string;
  maCa: string;
  maThietBi: string;
  tenThietBi: string;
  nguoiNhap: string;
}

export interface Quantity {
  id: number;
  idNhapThongKe: number;
  ngayNhap: number;
  tuGio: string;
  denGio: string;
  idPhieuSp: number;
  idThanhPham: number;
  idDonViTinh: number;
  noiDungCongViec: string;
  tongSanLuong: number;
  sanLuongHong: number;
  idCongDoan: number;
  bitLenBai: boolean;
  tenThanhPham: string;
  tenCongDoan: string;
  tenDonViTinh: string;
}

export interface StaffsGroup {
  maNhanVien: number;
  maNhanVienBD: string;
  hoTen: string;
  idChucDanhNv: number;
  dienThoai: string | null;
  email: string;
  ngaySinh: string | null;
  gioiTinh: string;
  diaChi: string;
  tenChucDanh: string;
  bitTruongCa: boolean;
}

export interface Position {
  maChucDanh: number;
  maChucDanhBD: string;
  tenChucDanh: string;
  bitTruongCa: boolean;
}

export interface Device {
  idThietBi: number;
  maThietBi: string;
  tenThietBi: string;
}

export interface Shift {
  id: number;
  maCa: string;
  tenCa: string;
  tuGio: string;
  denGio: string;
}

export interface StaffList {
  staffSelected: Staff;
  positionSelected: Position;
}

export interface ManagementStatistic {
  id: number;
  commonInfo: CommonInfo;
  staffsGroup: StaffsInfo[];
  quantityGroup: QuantityInfo[];
}

export interface CommonInfo {
  dateInput: string;
  deviceSelected: Device;
  shiftSelected: Shift;
  note: string;
}

export interface StaffsInfo {
  staffSelected: Staff;
  positionSelected: Position;
}

export interface QuantityInfo {
  id?: number | null;
  idNhapThongKe?: number | null;
  ngayNhap?: number | null;
  fromHour: string;
  toHour: string;
  ticketSelected: ProductTicket;
  stageSelected: Stage;
  unitSelected: Unit;
  postType: number;
  note: string;
  sumQuantity: number;
  failQuantity: number;
  status?: number | null;
}
export interface StatisticManagementResponse {
  ghiChu: string;
  id: number;
  idCa: number;
  idThietBi: number;
  maCa: string;
  maThietBi: string;
  ngayNhap: number;
  nguoiNhap: string;
  nhanVien: string;
  soPhieu: number;
  tenCa: string;
  tenThietBi: string;
}

export interface StatisticDetailData {
  id: number;
  idThietBi: number;
  tenThietBi: string;
  idCa: number;
  tenCa: string;
  idCongDoan: number;
  tenCongDoan: any;
  ngayNhap: string;
  ghiChu: string;
  bitDuyet: boolean;
  nhomThoThongKeList: Staff[];
  sanLuongThongKeList: SanLuongThongKeList[];
  tieuHaoThongKeList: TieuHaoThongKeList[];
  hoatDongThongKeList: HoatDongThongKeList[];
}

export interface NhomThoThongKeList {
  id?: number;
  maNhanVien: any;
  maNhanVienBD: any;
  hoTen: any;
  idChucDanhNv: any;
  dienThoai: any;
  email: any;
  ngaySinh: any;
  gioiTinh: any;
  diaChi: any;
  tenChucDanh: string;
  bitTruongCa: boolean;
  displayName: string;
  status?: number;
}

export interface SanLuongThongKeList {
  id: number;
  idNhapThongKe: number;
  ngayNhap: number;
  tuGio: string;
  denGio: string;
  idPhieuSp: number;
  idThanhPham: number;
  idDonViTinh: number;
  noiDungCongViec: string;
  tongSanLuong: number;
  sanLuongHong: number;
  idCongDoan: number;
  bitLenBai: boolean;
  tenThanhPham: string;
  tenCongDoan: string;
  tenDonViTinh: string;
  status?: number;
  soPhieuSp: string;
}

export interface TieuHaoThongKeList {
  id: number;
  idVatTu: number;
  idDonViTinh: number;
  soLuong: number;
  ghiChu: string;
  nhanVien: any;
  idUser: number;
  soPhieu: number;
  idPhieuSp: number;
  tenVatTu: string;
  tenDonViTinh: string;
  status?: number;
}

export interface HoatDongThongKeList {
  id: number;
  idNhapThongKe: number;
  ngayNhap: number;
  tuGio: string;
  denGio: string;
  soGio: number;
  noiDung: string;
  ghiChu: string;
  idLyDo: number;
  idCongDoan: number;
  lyDo: any;
  tenCongDoan: any;
  status?: number;
}
