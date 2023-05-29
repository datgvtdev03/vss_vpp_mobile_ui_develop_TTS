export type ListPrinter = {
  success: boolean;
  message: string;
  body: Printer[];
};

export type Printer = {
  name: string;
  location: string;
};
