//
//  CallvideoNative.m
//  vpp
//
//  Created by MINH NGOC on 13/12/2021.
//

#import <React/RCTBridgeModule.h>
#import <Foundation/Foundation.h>

@interface RCT_EXTERN_MODULE(CallvideoNative, NSObject)

RCT_EXTERN_METHOD(videocall: NSString resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(call: NSString)
RCT_EXTERN_METHOD(chat: NSString)

@end
