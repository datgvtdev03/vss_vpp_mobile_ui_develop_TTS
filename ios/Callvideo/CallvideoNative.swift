//
//  CallvideoNative.swift
//  vpp
//
//  Created by MINH NGOC on 13/12/2021.
//

import Foundation
import MyccSDK
@objc(CallvideoNative)
class CallvideoNative: NSObject {
  
  @objc(videocall:resolve:reject:)
  func videocall(sdt: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
//    SDKCallChatConfig.instance().setConfig(userName: sdt, sipDomain: "mbccs.mycc.vn", hashingKey: "myCC@2021", requestedBy: "myviettelstore-xnk", apiBaseUrl: ["https://sbc0mycc.viettel.vn:8006/devices", "https://sbc1mycc.viettel.vn:8006/devices", "https://sbc2mycc.viettel.vn:8006/devices"])
//
//    DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500)) {
//      SDKCallChatManager.instance().showVideoCall(toPhoneNumber: "videocall", parent: UIApplication.shared.windows.first!.rootViewController!)
//    }
    DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500)) {
      let callVideoController = CallVideoViewController()
      callVideoController.sdt = sdt
      callVideoController.onDoneVideoCall = {
        resolve(true)
      }
      (UIApplication.shared.windows.first!.rootViewController! as? UINavigationController)?.pushViewController(callVideoController, animated: true)
    }
    
  }
  @objc(call:)
  func call(sdt: String){
    SDKCallChatConfig.instance().setConfig(userName: sdt, sipDomain: "mbccs.mycc.vn", hashingKey: "myCC@2021", requestedBy: "myviettelstore-xnk", apiBaseUrl: ["https://sbc0mycc.viettel.vn:8006/devices", "https://sbc1mycc.viettel.vn:8006/devices", "https://sbc2mycc.viettel.vn:8006/devices"])
    
    DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500)) {
      SDKCallChatManager.instance().showCall(toPhoneNumber: "voicecall", parent: UIApplication.shared.windows.first!.rootViewController!)
    }
  }
}

