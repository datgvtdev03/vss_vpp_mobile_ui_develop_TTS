import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const numberFormatter = new Intl.NumberFormat();
const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export const newFormatVND = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatDateSim = (): string => {
  return dayjs(new Date(Date.now())).format("YYYY-MM-DDTHH:mm:ss");
};
export const formatNumber = (price: number): string => {
  return numberFormatter.format(price);
};

export const formatVND = (price: number): string => {
  //bỏ các ký tự sau dấu '.'
  if (price?.toString()) {
    const dataClearAfterDot = price.toString().split("");
    let indexSubstr = 0;
    for (let i = 0; i < dataClearAfterDot.length; i++) {
      if (dataClearAfterDot[i] === ".") {
        indexSubstr = i;
        break;
      }
    }
    let stringConvert = price.toString();
    if (indexSubstr !== 0) {
      stringConvert = stringConvert.substring(0, indexSubstr);
    }
    return stringConvert.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return vndFormatter.format(price);
};

export const formatDate = (date: Date): string => {
  return dayjs(date).format("YYYY-DD-MM HH:mm:ss.SSS");
};

export const formatDateToString = (
  date: Date,
  formatString: string
): string => {
  return dayjs(date).format(formatString);
};

export const parseDate = (formattedDate: string): Date => {
  return dayjs(formattedDate, "YYYY-DD-MM HH:mm:ss.SSS").toDate();
};

export const stringToDate = (_date, _format, _delimiter) => {
  const formatLowerCase = _format
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, _delimiter);

  const formatItems = formatLowerCase.split(_delimiter);

  const dateItems = _date
    .replace(/[^a-zA-Z0-9]/g, _delimiter)
    .split(_delimiter);
  const monthIndex = formatItems.indexOf("mm");
  const dayIndex = formatItems.indexOf("dd");
  const yearIndex = formatItems.indexOf("yyyy");
  const hourIndex = formatItems.indexOf("hh");
  const minutesIndex = formatItems.indexOf("ii");
  const secondsIndex = formatItems.indexOf("ss");
  let month = parseInt(dateItems[monthIndex]);
  month -= 1;
  const formatedDate = new Date(
    dateItems[yearIndex],
    month,
    dateItems[dayIndex],
    dateItems[hourIndex],
    dateItems[minutesIndex],
    dateItems[secondsIndex]
  );
  return formatedDate;
};

export const formatDurationFromSeconds = (seconds: number): string => {
  // eslint-disable-next-line no-bitwise
  const hour = ~~(seconds / (60 * 60));
  // eslint-disable-next-line no-bitwise
  const minute = ~~(seconds / 60);
  return hour > 0 ? `${hour} giờ ${minute} phút` : `${minute} phút`;
};

export const getRemainingTimeString = ({
  fromDate,
  toDate,
}: {
  fromDate?: Date;
  toDate?: Date;
}): string => {
  toDate = toDate || new Date();
  fromDate = fromDate || new Date();
  const durationObj = dayjs.duration(dayjs(toDate).diff(dayjs(fromDate)));
  // if (duration.asSeconds() <= 0) {
  //   return '0 giây';
  // }

  const years = durationObj.years();
  const months = durationObj.months();
  const days = durationObj.days();
  const hours = durationObj.hours();
  const minutes = durationObj.minutes();
  const seconds = durationObj.seconds();

  let formattedString = "";
  if (years) {
    formattedString = formattedString.concat(`${years} năm `);
    return formattedString;
  }
  if (months) {
    formattedString = formattedString.concat(`${months} tháng `);
    return formattedString;
  }
  if (days) {
    formattedString = formattedString.concat(`${days} ngày `);
    return formattedString;
  }
  if (hours) {
    formattedString = formattedString.concat(`${hours} giờ `);
    return formattedString;
  }
  if (minutes) {
    formattedString = formattedString.concat(`${minutes} phút `);
    return formattedString;
  }
  if (seconds) {
    formattedString = formattedString.concat(`${seconds} giây`);
    return formattedString;
  }
  return "Không có dữ liệu";
};

export const isNotEmptyStr = (str: string | undefined): boolean => {
  return typeof str === "string" && Boolean(str.trim().length);
};

export const isObjectEmpty = (
  obj: Record<string, unknown> | undefined
): boolean => {
  return obj === undefined || (Boolean(obj) && Object.keys(obj).length === 0);
};

export const regexGmail = /^[a-zA-Z0-9](\.?[a-z0-9]){1,}@gmail\.com$/;
// eslint-disable-next-line no-useless-escape
export const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const regexPhoneNumber =
  /^(?=\d{10}$)(0564|0563|0584|0585|0586|0587|0588|0589|0583|0565|0566|0567|0568|0569|0582|0592|0593|0598|0599|039|038|037|036|035|034|033|032|070|079|077|076|078|085|084|083|082|081|090|091|092|093|094|095|096|097|098|099|083|086|087|088|089)\d+/;
export const regexViettel =
  /^(?=\d{10}$)(086|096|097|098|039|038|037|036|035|034|033|032)\d+/;
export const regexVina = /^(?=\d{10}$)(091|094|088|083|084|085|081|082)\d+/;
export const regexMobi = /^(?=\d{10}$)(070|079|077|076|078|089|090|093)\d+/;
export const regexVNM = /^(?=\d{10}$)(056|058|052|092)\d+/;
export const regexGmobi = /^(?=\d{10}$)(059|099)\d+/;
export const regexCharacterSpecial = /^[a-zA-Z0-9]+$/;
export const spaceBetweenPhone = (number) => {
  return number.replace(/\D*(\d{4})\D*(\d{3})\D*(\d{3})\D*/, "$1 $2 $3");
};

export const splitImagesString = (string: string | null): string => {
  if (string === null) return "";
  const result = string.split(",");
  return result.length > 0 ? result[0] : "";
};

export const formatVNCurrency = (price: string): string => {
  return price + ` đ`;
};

export const getEndpointUrl = (url: string): string => {
  const _link = "http://27.71.226.77:8680";
  const _endpoint = url && url.split(_link).pop();
  return _endpoint || "";
};

export const addZeroToPhoneNumber = (phoneNumber: string) => {
  const _phoneNumber =
    phoneNumber[0] !== String(0) && phoneNumber.length === 9
      ? "0" + phoneNumber
      : phoneNumber;
  return _phoneNumber;
};

export const isDisableAction = (arr: string[]) => {
  return arr.some((item) => Boolean(item));
};

export const isValidEmail = (email: string) => {
  if ((email && regEmail.test(email)) || !email) {
    return true;
  } else {
    return false;
  }
};

export const convertStringToDate = (dateString: string) => {
  if (dateString) {
    const dateArray = dateString.split("/");
    const newDate = dateArray[1] + "/" + dateArray[0] + "/" + dateArray[2];
    const resDate = dayjs(newDate).toDate();
    return resDate;
  }
};

export const isEmptyObj = <O>(obj: O): boolean => {
  if (obj === null || obj === undefined) return true;
  if (obj instanceof Array) return true;
  if (typeof obj === "object") {
    return Object.keys(obj).length === 0;
  } else {
    return false;
  }
};

export const isHasLength = <A>(arr: A): boolean => {
  if (arr === null || arr === undefined) return false;
  if (arr instanceof Array) {
    return arr.length > 0 ? true : false;
  } else {
    return false;
  }
};

export const randomId = () => {
  return Math.floor(Math.random() * 10000);
};
