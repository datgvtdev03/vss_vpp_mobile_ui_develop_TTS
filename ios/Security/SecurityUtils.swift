//
//  SecurityUtils.swift
//  vpp
//
//  Created by MINH NGOC on 25/11/2021.
//
import UIKit
import Foundation
import CommonCrypto

@objc(SecurityUtil)
class SecurityUtil : NSObject{
  //key ma hoa AES
  static var AES_KEY = "r8t-TbKl20XF5W#Q"
  static var INIT_VECTOR = "ydhSi54MiLcKpPe-"
  @objc(encrypt:resolve:reject:)
  func encrypt( inputs: Any,_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    let key = SecurityUtil.AES_KEY
    let iv = SecurityUtil.INIT_VECTOR
    let options = kCCOptionPKCS7Padding
    func jsonToData(json: Any) -> Data? {
      do {
        return try JSONSerialization.data(withJSONObject: json, options: [])
      } catch let myJSONError {
        print(myJSONError)
        return nil;
      }
      
      
    }
    guard let data = jsonToData(json: inputs) else {
      resolve("")
      return
    }
    let theJSONText = String(data: data,
                             encoding: .ascii) ?? "error"
    print(theJSONText)
    if let keyData = key.data(using: String.Encoding.utf8),
       let cryptData    = NSMutableData(length: Int((data.count)) + kCCBlockSizeAES128) {
      
      let keyLength              = size_t(kCCKeySizeAES128)
      let operation: CCOperation = UInt32(kCCEncrypt)
      let algoritm:  CCAlgorithm = UInt32(kCCAlgorithmAES128)
      let options:   CCOptions   = UInt32(options)
      
      
      var numBytesEncrypted :size_t = 0
      
      let cryptStatus = CCCrypt(operation,
                                algoritm,
                                options,
                                (keyData as NSData).bytes, keyLength,
                                iv,
                                (data as NSData).bytes, data.count,
                                cryptData.mutableBytes, cryptData.length,
                                &numBytesEncrypted)
      if UInt32(cryptStatus) == UInt32(kCCSuccess) {
        cryptData.length = Int(numBytesEncrypted)
        let base64cryptString = cryptData.base64EncodedString(options: [])
        resolve(base64cryptString)
        return
        
        
        
      }
      else {
        resolve(nil)
        return
      }
    }
    resolve(nil)
    return
  }
  
  
  @objc(decrypt:resolve:reject:)
  func decrypt(inputs: String,_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> String? {
    let key = SecurityUtil.AES_KEY
    let iv = SecurityUtil.INIT_VECTOR
    let options = kCCOptionPKCS7Padding
    if let keyData = key.data(using: String.Encoding.utf8),
       let data = NSData(base64Encoded: inputs, options: .ignoreUnknownCharacters),
       let cryptData    = NSMutableData(length: Int((data.length)) + kCCBlockSizeAES128) {
      
      let keyLength              = size_t(kCCKeySizeAES128)
      let operation: CCOperation = UInt32(kCCDecrypt)
      let algoritm:  CCAlgorithm = UInt32(kCCAlgorithmAES128)
      let options:   CCOptions   = UInt32(options)
      
      var numBytesEncrypted :size_t = 0
      
      let cryptStatus = CCCrypt(operation,
                                algoritm,
                                options,
                                (keyData as NSData).bytes, keyLength,
                                iv,
                                data.bytes, data.length,
                                cryptData.mutableBytes, cryptData.length,
                                &numBytesEncrypted)
      
      if UInt32(cryptStatus) == UInt32(kCCSuccess) {
        cryptData.length = Int(numBytesEncrypted)
        let unencryptedMessage = String(data: cryptData as Data, encoding:String.Encoding.utf8)
        return unencryptedMessage
      }
      else {
        return nil
      }
    }
    return nil
  }
  
  //    public static func jsonToData(json: Any) -> Data? {
  //        do {
  //            return try JSONSerialization.data(withJSONObject: json, options: [])
  //        } catch let myJSONError {
  //            print(myJSONError)
  //        }
  //        return nil;
  //    }
}
