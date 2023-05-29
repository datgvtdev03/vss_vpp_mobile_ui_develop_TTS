//
//  CallVideoViewController.swift
//  vpp
//
//  Created by Do Xuan Tien on 26/01/2022.
//

import Foundation
class CallVideoViewController: UIViewController {
  var sdt: String = ""
  var onDoneVideoCall: (() -> Void)?
  var isOpenSDK = false
  override func viewDidLoad() {
    SDKCallChatConfig.instance().setConfig(userName: sdt, sipDomain: "mbccs.mycc.vn", hashingKey: "myCC@2021", requestedBy: "myviettelstore-xnk", apiBaseUrl: ["https://sbc0mycc.viettel.vn:8006/devices", "https://sbc1mycc.viettel.vn:8006/devices", "https://sbc2mycc.viettel.vn:8006/devices"])
    
    DispatchQueue.main.asyncAfter(deadline: .now() + .milliseconds(500)) {
      self.isOpenSDK = true
      SDKCallChatManager.instance().showVideoCall(toPhoneNumber: "videocall", parent: self)
    }
  }
    
  override func viewDidAppear(_ animated: Bool) {
    if isOpenSDK {
      (onDoneVideoCall ?? {})()
      navigationController?.popViewController(animated: true)
    }
  }
}
