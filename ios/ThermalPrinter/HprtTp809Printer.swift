import UIKit
@objc(HprtTp809Printer)
class HprtTp809Printer: NSObject {
  static var LOCATION_PERMISSION_NOT_GRANTED = "-100";
  static var IP_OR_PORT_EMPTY = "-200";
  static var CONNECTION_FAILED = "-300";
  static var INVALID_FILE_PATH = "-400";
  static var INVALID_FILE_EXTENSION = "-500"
  static var PRINT_FILE_ERROR = "-600"
  static var READ_FILE_ERROR = "-700"
  static var STATUS_UNKNOWN = "-801"
  static var STATUS_READY = "800"
  static var STATUS_COVER_OPEN = "-802"
  static var STATUS_NO_PAPER = "-803"
  static var STATUS_PAPER_NEAR_END = "-804"
  static var STATUS_NOT_CONNECTED = "-805"
  static var STATUS_BUSY = "-806"
  static var STATUS_BATTERY_LOW = "-807"
  static var CLOSE_SUCCESS = "900"
  static var CLOSE_FAILURE = "-900"
  
  @objc(connectViaWifi:ip:port:resolve:reject:)
  func connectViaWifi(name: String, ip: String, port: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if (ip.trimmingCharacters(in: .whitespacesAndNewlines) == "" || port.trimmingCharacters(in: .whitespacesAndNewlines) == "") {
      reject("HprtTp809Printer", HprtTp809Printer.IP_OR_PORT_EMPTY, nil)
      return
    }
    if (PTDispatcher.share().printerConnected != nil) {
      PTDispatcher.share()?.unconnectPrinter(PTDispatcher.share().printerConnected)
    }
    let pt = PTPrinter.init()
    pt.ip = ip
    pt.module = .wiFi
    pt.port = port
    
    PTDispatcher.share().connect(pt)
    PTDispatcher.share().whenConnectSuccess {
      resolve(nil)
    }
    
    PTDispatcher.share().whenConnectFailureWithErrorBlock {_ in
      reject("HprtTp809Printer", HprtTp809Printer.CONNECTION_FAILED, nil)
    }
    
    PTDispatcher.share()?.whenReceiveData({data in
      //      reject("HprtTp809Printer", HprtTp809Printer.CONNECTION_FAILED, nil)
      //      Swift.print(data)
    })
  }
  
  @objc(getCurrentPrinterStatus:reject:)
  func getCurrentPrinterStatus(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let esc = PTCommandESC.init()
    esc.getPrinterStatus()
    PTDispatcher.share()?.send(esc.getCommandData())
    PTDispatcher.share().whenSendFailure {
      resolve(HprtTp809Printer.STATUS_UNKNOWN)
    }
    PTDispatcher.share()?.whenReceiveData({ (data) in
      guard let tempData = data else { return }
      let byte = [UInt8](tempData)
      
      if byte[0] & 4 == 4 {
        resolve(HprtTp809Printer.STATUS_COVER_OPEN)
        return
      }
      
      if byte[1] & 96 == 96 {
        resolve(HprtTp809Printer.STATUS_NO_PAPER)
        return
      }
      
      resolve(HprtTp809Printer.STATUS_READY)
    })
  }
  
  @objc(print:resolve:reject:)
  func print(options: Dictionary<String, Any>, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if (options["filePath"] == nil) {
      reject("HprtTp809Printer", HprtTp809Printer.INVALID_FILE_PATH, nil)
      return
    }
    let filePath = options["filePath"] as! String + ""
    if (!(filePath.contains(".jpg") || !filePath.contains(".png") || !filePath.contains(".jpeg") || !filePath.contains(".bmp") || !filePath.contains(".pdf"))) {
      reject("HprtTp809Printer", HprtTp809Printer.INVALID_FILE_EXTENSION, nil)
      return
    }
    
    var images: [UIImage?]
    if (filePath.contains(".pdf")) {
      images = self.drawIMGfromPDF(filePath: filePath)
    } else {
      images = [UIImage(contentsOfFile: filePath)]
    }
    var cmdData = Data()
   
    for image in images {
      guard let img = image else { continue }
      let cmd = PTCommandESC.init()
      let anh = PDPrinterCPCLStatusOptionSet.scaleImageForWidth(image: img, width: 575)
      cmd.appendRasterImage(anh?.cgImage, mode: .binary, compress: .LZO, package: true)
      cmd.setPrinterAutomaticPosition()
      cmdData.append(cmd.getCommandData())
    }
    let cutCmd = PTCommandESC.init()
    cutCmd.setFullCutWithDistance(75)
    cmdData.append(cutCmd.getCommandData())
    
    if PTDispatcher.share().printerConnected == nil {
      reject("HprtTp809Printer", HprtTp809Printer.STATUS_NOT_CONNECTED, nil)
      return
    }
    
    PTDispatcher.share().send(cmdData)
    
    PTDispatcher.share().whenSendFailure {
      reject("HprtTp809Printer", HprtTp809Printer.PRINT_FILE_ERROR, nil)
    }
    
    PTDispatcher.share()?.whenSendSuccess({(_,_) in
      resolve(nil)
    })
  }
  
  func drawIMGfromPDF(filePath: String) -> [UIImage?] {
    
    let url = URL(fileURLWithPath: filePath)

    guard let document = PDFDocument(url: url) else { return [] }
    // Print only first page
    var images: [UIImage?] = []
    for pageNo in 0...document.pageCount {
      guard let page = document.page(at: pageNo) else { continue }
      let bounds = page.bounds(for: PDFDisplayBox.mediaBox)
      let size = bounds.size
      let pageImage = PDPrinterCPCLStatusOptionSet.scaleImageForWidth(image: page.thumbnail(of: CGSize(width: 567, height: 567*size.height/size.width), for: .mediaBox), width: 575)
      images.append(pageImage)
    }

    return images
  }
  
  @objc(disconnect:reject:)
  func disconnect(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    if (PTDispatcher.share().printerConnected != nil) {
      PTDispatcher.share()?.unconnectPrinter(PTDispatcher.share().printerConnected)
    }
    PTDispatcher.share().whenSendFailure {
      reject("HprtTp809Printer", HprtTp809Printer.CLOSE_FAILURE, nil)
    }
    PTDispatcher.share()?.whenUnconnect({ (_, _) in
      resolve(HprtTp809Printer.CLOSE_SUCCESS)
      
    })
  }
}

//Printer Status
struct PDPrinterCPCLStatusOptionSet : OptionSet,CustomStringConvertible {
  
  var rawValue: UInt8
  typealias RawValue = UInt8
  
  static let busy = PDPrinterCPCLStatusOptionSet.init(rawValue: 1<<0)
  static let paperEnd = PDPrinterCPCLStatusOptionSet.init(rawValue: 1<<1)
  static let openCover = PDPrinterCPCLStatusOptionSet.init(rawValue: 1<<2)
  static let lowVoltage = PDPrinterCPCLStatusOptionSet.init(rawValue: 1<<3)
  
  var description: String {
    
    if contains(.busy) {
      return HprtTp809Printer.STATUS_BUSY
    }
    
    if contains(.paperEnd) {
      return HprtTp809Printer.STATUS_NO_PAPER
    }
    
    if contains(.openCover) {
      return HprtTp809Printer.STATUS_COVER_OPEN
    }
    
    if contains(.lowVoltage) {
      return HprtTp809Printer.STATUS_BATTERY_LOW
    }
    
    return HprtTp809Printer.STATUS_READY
  }
  
  static func scaleSourceImage(image:UIImage, width:CGFloat, height:CGFloat) -> UIImage? {
      
      let drawWidth = CGFloat(ceil(width))
      let drawHeight = CGFloat(ceil(height))
      let size = CGSize(width: drawWidth, height: drawHeight)
      //该处绘制图片是向上取整
      UIGraphicsBeginImageContextWithOptions(size, true, 1.0)
      guard let context = UIGraphicsGetCurrentContext() else { return nil }
      context.interpolationQuality = .high
      context.setShouldAntialias(true)
      context.setAllowsAntialiasing(true)
      image.draw(in: CGRect.init(x: 0, y: 0, width: drawWidth, height: drawHeight))
      let scaleImage = UIGraphicsGetImageFromCurrentImageContext()
      UIGraphicsEndImageContext()
      return scaleImage
  }
  
  static func scaleImageForWidth(image:UIImage, width:CGFloat) -> UIImage? {
      
      let imageW = image.size.width
      let imageH = image.size.height
      var maxH : CGFloat = 0
//        if imageW > width {
//
//        }else {
//            return image
//        }
      //此处将高度取整
      maxH = CGFloat(Int(width * imageH / imageW))
      return self.scaleSourceImage(image: image, width: width, height: maxH)
  }
}
